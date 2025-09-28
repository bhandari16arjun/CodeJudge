const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  password:      { type: String, required: true },

  role:          { type: String, enum: ['user','problemSetter'], default: 'user' },
  globalRank:    { type: Number, default: 0 },
  codingTitle: {
    type: String,
    enum: [
      'Newbie',
      'Pupil',
      'Specialist',
      'Expert',
      'Candidate Master',
      'Master',
      'Grand Master'
    ],
    default: 'Newbie'
  },

  solvedProblems: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }
  ],

  activity: {
    type: Map,
    of: Number,
    default: {}
  },

  solvedTotal:  { type: Number, default: 0 },
  solvedEasy:   { type: Number, default: 0 },
  solvedMedium: { type: Number, default: 0 },
  solvedHard:   { type: Number, default: 0 },

  submissions:         { type: Number, default: 0 },
  correctSubmissions:  { type: Number, default: 0 },
  monthlyRanks: {
    type: Map,
    of: Number,
    default: {}
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
