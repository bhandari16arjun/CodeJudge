const { required } = require('joi');
const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  statement : { type: String, required: true },
  problemNumber : {
    type : Number,
    required : true,
  },
  constraints: {
    type: String,
    required: true
  },

  timeLimit: {
    type: Number,
    default: 2  
  },

  memoryLimit: {
    type: Number,
    default: 256
  },

  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },

  tags: {
    type: [String],
    default: []
  },

  createdBy: {
    type : String,
    required : true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Problem = mongoose.model('Problem', ProblemSchema);
module.exports = Problem;
