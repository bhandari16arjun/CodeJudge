const Run = require("../models/run");
const {runQueue} = require("../config/redisConfig"); 

exports.createRun = async (req, res) => {
  try {
    const { problemNumber, code, language , testCases } = req.body;
    if (!problemNumber || !code || !language || !Array.isArray(testCases)){
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }
   
    const run = await Run.create({
      problemNumber,
      code,
      language,
      testCases,
    });
    // console.log("hello");
    await runQueue.add({
      runId: run._id.toString(),
      code,
      language,
      testCases,
    });
    return res.status(202).json({ success: true, runId: run._id });
  } catch (err) {
    console.error("createRun error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getRunStatus = async (req, res) => {
  try {
    const { runId } = req.params;
    const run = await Run.findById(runId).lean();
    if (!run) {
      return res.status(404).json({ success: false, error: "Run not found" });
    }
    return res.json({
      success: true,
      verdict: run.verdict,        
      outputs: run.outputs,       
      error:   run.error,
    });
  } catch (err) {
    console.error("getRunStatus error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};