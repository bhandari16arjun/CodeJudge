const { submissionQueue } = require("./config/redisQueue");
const Submission          = require("./models/submission");
const runCode             = require("./runCode");

submissionQueue.process(async (job, done) => {
  const { submissionId, code, language, testcases, limits } = job.data;

  try {
    const result = await runCode({ language, code, testcases, limits });

    const update = {
      verdict : result.status,
      endedAt : new Date(),
    };

    if (result.status === "Accepted") {
      update.totalTimeMs   = result.totalTimeMs;
      update.totalMemoryKb = result.totalMemoryKb;
    }
    if (result.error) {
      update.errorMessage = result.error;
    }
    if (result.failedTestcase) {
      const tc = testcases[result.failedTestcase - 1];
      update.failedTestCase = {
        input          : tc.input,
        expectedOutput : tc.expectedOutput,
        actualOutput   : result.actualOutput,
        errorType      : result.status,
      };
    }

    await Submission.findByIdAndUpdate(submissionId, update);
    done();
  } catch (err) {
    await Submission.findByIdAndUpdate(submissionId, {
      verdict      : "System Error",
      errorMessage : err.message,
      endedAt      : new Date(),
      expireAt     : new Date(Date.now() + 10 * 60 * 1000),
    });
    done(err);
  }
});