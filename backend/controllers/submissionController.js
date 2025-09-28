const Submission = require('../models/submission');
const  { getTestCasesFromS3 }  = require('../utils/s3Fetcher');
const { submissionQueue } = require('../config/redisConfig');
const Problem             = require('../models/problem'); 
const User                = require('../models/users');
exports.createSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    if (problemId === undefined || problemId === null || !code || !language) {
      return res.status(400).json({
        success : false,
        message : 'Missing required fields: problemId, code, or language',
      });
    }


    if (!Number.isInteger(problemId)) {
      return res.status(400).json({
        success : false,
        message : 'problemId must be an integer (problem number)',
      });
    }

   
    const problemDoc = await Problem
      .findOne({ problemNumber: problemId })
      .select('_id')
      .lean();

    if (!problemDoc) {
      return res.status(404).json({
        success : false,
        message : `Problem with number ${problemId} not found`,
      });
    }

    const problemMongoIdStr = problemDoc._id.toString(); 

    const submission = await Submission.create({
      userId        : req.user.id,
      problemNumber : problemId,          
      problemId     : problemDoc._id,    
      code,
      language,
      verdict       : 'Pending',
      startedAt     : new Date(),
    });
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { submissions: 1 } }
    );
    const testcases = await getTestCasesFromS3(problemMongoIdStr,"hiddenTestCases.json");

    await submissionQueue.add(
      {
        submissionId : submission._id.toString(), 
        code,
        language,
        testcases,
        limits       : { time: 2000, memory: 256 }, 
      },
    );

    return res.status(201).json({
      success      : true,
      message      : 'Submission received and queued for execution',
      submissionId : submission._id,
    });

  } catch (err) {
    console.error('[createSubmission]', err);
    return res.status(500).json({
      success : false,
      message : 'Server error during submission. Please try again.',
    });
  }
};

exports.getSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);

    if (!submission)
      return res.status(404).json({ success: false, message: 'Submission not found' });

    if (submission.userId.toString() !== req.user.id.toString())
      return res.status(403).json({ success: false, message: 'Forbidden' });

    if (
      submission.verdict === 'Accepted' &&
      !submission.correctSubmissionCounted
    ) {
      await User.findByIdAndUpdate(submission.userId, {
        $inc: { correctSubmissions: 1 }
      });

      submission.correctSubmissionCounted = true;
      await submission.save();
    }

    return res.json({
      success        : true,
      verdict        : submission.verdict,         
      errorMessage   : submission.errorMessage || submission.error || '',
      failedTestCase : submission.failedTestCase || null, 
    });

  } catch (err) {
    console.error('[getSubmissionStatus]', err);
    return res.status(500).json({ success: false, message: 'Could not fetch submission' });
  }
};


exports.getRecentSubmissions = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1)
    const limit = Math.max(1, parseInt(req.query.limit) || 5)
    const skip  = (page - 1) * limit
    const userId = req.user.id

    const totalCount = await Submission.countDocuments({ userId })

    const subs = await Submission.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('problemId', 'title difficulty')
      .lean()

    const submissions = subs.map(s => ({
      id:           s._id,
      problemTitle: s.problemId.title,
      problemNumber : String(s.problemNumber),
      difficulty:   s.problemId.difficulty,
      language:     s.language,
      runtime:      s.totalTimeMs != null ? `${s.totalTimeMs} ms` : null,
      memory:       s.totalMemoryKb != null ? `${s.totalMemoryKb} KB` : null,
      verdict:      s.verdict,
      submittedAt:  s.createdAt,
      code:         s.code
    }))

    return res.json({
      success:      true,
      page,
      totalPages:   Math.ceil(totalCount / limit),
      totalCount,
      submissions
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching recent submissions'
    })
  }
}









