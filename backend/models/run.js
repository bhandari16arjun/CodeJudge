const mongoose = require('mongoose');

const RunSchema = new mongoose.Schema({
  problemNumber: {
    type: Number,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['cpp','java','python'],
    required: true
  },
  outputs: {
    type: [{
      output : { type: String, required: true },
      _id : false
    }],
    default: []
  },
  verdict: {
    type: String,
    enum: ['pending','done','Time Limit Exceeded','Memory Limit Exceeded','Compilation Error','System Error'],
    default: 'pending'
  },
  testCases: [
  {
    _id: false,                 
    input: { type: String, required: true }
  }
  ],
  error: { type: String }
  }, 
  {
  timestamps: true
});

RunSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model('Run', RunSchema);
