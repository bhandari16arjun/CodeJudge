const {ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const s3                                    = require('../config/awsConfig');
const uploadToS3                            = require('../utils/uploadToS3');
const { getTestCasesFromS3 }                = require('../utils/S3Fetcher');
const Problem                               = require('../models/problem');
const slugify                               = require('slugify');
const deleteS3Folder = require('../utils/deleteS3Folder');


exports.addProblem = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'problemSetter') {
      return res.status(403).json({ error: 'Only problem setters can upload problems.' });
    }

    const { title, statement, constraints, difficulty, tags } = req.body;
    if (!title?.trim() || !statement?.trim() || !constraints?.trim() || !difficulty?.trim() || !tags) {
      return res.status(400).json({ error: 'Missing required text fields.' });
    }

    const sampleFile = req.files.sampleTestCases?.[0];
    const hiddenFile = req.files.hiddenTestCases?.[0];
    if (!sampleFile || !hiddenFile) {
      return res.status(400).json({ error: 'Both sampleTestCases and hiddenTestCases JSON files are required.' });
    }

    try {
      JSON.parse(sampleFile.buffer.toString('utf-8'));
      JSON.parse(hiddenFile.buffer.toString('utf-8'));
    } catch {
      return res.status(400).json({ error: 'Uploaded files must be valid JSON.' });
    }

    const count      = await Problem.countDocuments({});
    const nextNumber = count + 1;

    const problem = new Problem({
      title:          title.trim(),
      statement:      statement.trim(),
      constraints:    constraints.trim(),
      difficulty:     difficulty.trim(),
      tags:           JSON.parse(tags),
      createdBy:      req.user._id,
      slug:           slugify(title, { lower: true, strict: true }),
      problemNumber:  nextNumber,    
    });
    await problem.save();

    const id = problem._id.toString();
    const [ sampleUrl, hiddenUrl ] = await Promise.all([
      uploadToS3(sampleFile.buffer,  id, 'sampleTestCases.json', sampleFile.mimetype),
      uploadToS3(hiddenFile.buffer, id, 'hiddenTestCases.json', hiddenFile.mimetype),
    ]);

    problem.sampleTestCasesUrl = sampleUrl;
    problem.hiddenTestCasesUrl = hiddenUrl;
    await problem.save();

    res.status(201).json({ message: 'Problem added!', problem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while adding problem.' });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || req.user.role !== 'problemSetter') {
      return res.status(403).json({ error: 'Only problem setters can update problems.' });
    }

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }
    if (problem.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You do not own this problem.' });
    }

    const { title, statement, constraints, difficulty, tags } = req.body;
    if (title)       problem.title       = title.trim();
    if (statement)   problem.statement   = statement.trim();
    if (constraints) problem.constraints = constraints.trim();
    if (difficulty)  problem.difficulty  = difficulty.trim();
    if (tags)        problem.tags        = JSON.parse(tags);
    problem.slug = slugify(problem.title, { lower: true, strict: true });

    const sampleFile = req.files?.sampleTestCases?.[0];
    const hiddenFile = req.files?.hiddenTestCases?.[0];
    if (sampleFile) {
      await uploadToS3(sampleFile.buffer, id, 'sampleTestCases.json', sampleFile.mimetype);
    }
    if (hiddenFile) {
      await uploadToS3(hiddenFile.buffer, id, 'hiddenTestCases.json', hiddenFile.mimetype);
    }

    await problem.save();
    res.json({ message: 'Problem updated.', problem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating problem.' });
  }
};

exports.getProblemMeta = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findById(id).lean();
    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    return res.json({ problem });
  } catch (err) {
    console.error("Error fetching problem meta:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch problem metadata." });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user || req.user.role !== 'problemSetter') {
      return res.status(403).json({ error: 'Only problem setters can delete problems.' });
    }

    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }
    if (problem.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You do not own this problem.' });
    }
    await deleteS3Folder(id);

    await problem.deleteOne();
    res.json({ message: 'Problem and its files deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error deleting problem.' });
  }
};

exports.getMyProblems = async (req, res) => {
  try {
    console.log(req.user)
    if (!req.user || req.user.role !== "problemSetter") {
      return res
        .status(403)
        .json({ error: "Only problem setters can view their problems, heelleeo." });
    }

    const myProblems = await Problem.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });         

    res.json({ problems: myProblems });
  } catch (err) {
    console.error("Error fetching my problems:", err);
    res.status(500).json({ error: "Failed to fetch your problems." });
  }
};

exports.getProblemTestCases = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await Problem.exists({ _id: id });
    if (!exists) {
      return res.status(404).json({ error: "Problem not found." });
    }

    const sample = await getTestCasesFromS3(id, "sampleTestCases.json");
    const hidden = await getTestCasesFromS3(id, "hiddenTestCases.json");

    return res.json({
      sampleTestCases: sample,
      hiddenTestCases: hidden,
    });
  } catch (err) {
    console.error("Error fetching test-case files:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch test-case files." });
  }
};

exports.getProblemSummary = async (req, res) => {
  try {
    const counts = await Problem.aggregate([
      { $group: { _id: "$difficulty", count: { $sum: 1 } } }
    ]);

    const summary = counts.reduce(
      (acc, cur) => ({ ...acc, [cur._id]: cur.count }),
      { Easy: 0, Medium: 0, Hard: 0 }
    );
    const total = summary.Easy + summary.Medium + summary.Hard;

    return res.json({ success: true, stats: { ...summary, total } });
  } catch (err) {
    console.error("Failed to build summary:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.listProblems = async (req, res) => {
  try {
    const limit = Math.min(+req.query.limit || 10, 50);
    const page  = Math.max(+req.query.page  || 1,  1);
    const skip  = (page - 1) * limit;

    const query = {};

    if (["Easy", "Medium", "Hard"].includes(req.query.difficulty)) {
      query.difficulty = req.query.difficulty;
    }

    if (req.query.tags) {
      const tags = req.query.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean);
      if (tags.length) query.tags = { $in: tags };
    }

    if (req.query.solved === "true" || req.query.solved === "false") {
      if (!req.user) {
        return res.status(401).json({ error: "Auth required for solved filter" });
      }
      query._id = req.query.solved === "true"
        ? { $in: req.user.solvedProblems }
        : { $nin: req.user.solvedProblems };
    }

    const problems = await Problem.find(query)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .select("title difficulty tags createdAt problemNumber _id");

    const total = await Problem.countDocuments(query);

    return res.json({
      success: true,
      page,
      limit,
      total,
      problems
    });
  } catch (err) {
    console.error("List problems failed:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getHotProblems = async (req, res) => {
  try {
    const problems = await Problem.find({})
      .sort({ createdAt: 1 })                 
      .limit(4)                                  
      .select("title difficulty tags createdAt problemNumber");
    return res.json({ success: true, problems });
  } catch (err) {
    console.error("Failed to fetch hot problems:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getProblemMetaAndSampleByNumber = async (req, res) => {
  try {
    const num = parseInt(req.params.number, 10);

    const problem = await Problem.findOne({ problemNumber: num })
      .select('_id problemNumber title statement constraints difficulty tags createdBy createdAt')
      .lean();
    if (!problem) {
      return res.status(404).json({ success: false, error: 'Problem not found' });
    }
    let sample;
    try {
      sample = await getTestCasesFromS3(String(problem._id), 'sampleTestCases.json');
    } catch (err) {
      console.error('S3 fetch error:', err);
      return res.status(500).json({
        success: false,
        error: 'Could not load sample test cases'
      });
    }

    return res.json({
      success: true,
      problem: {
        _id : problem._id,
        problemNumber:      problem.problemNumber,
        title:       problem.title,
        statement:   problem.statement,
        constraints: problem.constraints,
        difficulty:  problem.difficulty,
        tags:        problem.tags,
        createdBy:   problem.createdBy,
        createdAt:   problem.createdAt,
      },
      sampleTestCases: sample
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};