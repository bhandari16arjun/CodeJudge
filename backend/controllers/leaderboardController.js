const User = require('../models/users');

const getLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = { role: 'user' };

    const users = await User.find(query)
      .sort({ correctSubmissions: -1 })
      .skip(skip)
      .limit(limit)
      .select('name solvedTotal submissions correctSubmissions createdAt');

    const totalUsers = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
};

module.exports = { getLeaderboard };
