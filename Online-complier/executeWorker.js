// executeWorker.js
const { runQueue } = require("./config/redisQueue");
const Run          = require("./models/run");
const runCode      = require("./execute");

runQueue.process(async job => {
  const runId = job.data.runId;
  const doc   = await Run.findById(runId).lean();
  if (!doc) {
    console.warn(`Run ${runId} disappeared – skipping`);
    return;
  }

  try {
    const outputs = await runCode({
      language  : doc.language,
      code      : doc.code,
      testCases : doc.testCases.map(tc => ({ input: tc.input }))
    });

    await Run.updateOne(
      { _id: runId },
      { $set: { outputs, verdict: "done", error: null } }
    );
    console.log(`✔ Run ${runId} finished`);

  } catch (err) {
    const verdict = err.isCompile ? "Compilation Error" : "System Error";
    const error   = (err.stderr || err.message || "").toString().slice(0, 800);

    await Run.updateOne(
      { _id: runId },
      { $set: { verdict, error } }
    );
    console.error(`✖ Run ${runId} failed: ${verdict}`);
  }
});
