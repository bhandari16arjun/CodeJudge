const mongoose = require("mongoose")

const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  code: { type: String, required: true },
  language: {
    type: String,
    enum: ["cpp", "java", "python"],
    required: true
  },
  verdict: {
    type: String,
    enum: ["Pending", "Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded", "Memory Limit Exceeded", "Compilation Error", "System Error"],
    default: "Pending"
  },
  failedTestCase: {
    input: { type: String },
    expectedOutput: { type: String },
    actualOutput: { type: String },
    errorType: { type: String }
  },
  errorMessage: { type: String },
  totalTimeMs: { type: Number },
  totalMemoryKb: { type: Number },
  startedAt: { type: Date },
  endedAt: { type: Date },
  expireAt: { type: Date, default: () => new Date(Date.now() + 10 * 60 * 1000) }, 
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Submission", SubmissionSchema);
