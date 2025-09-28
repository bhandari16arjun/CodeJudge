const cron = require('node-cron');
const User = require('../models/users');

const getGlobalRank = (userId, sortedUsers) => {
  const index = sortedUsers.findIndex((user) => user._id.toString() === userId.toString());
  return index === -1 ? null : index + 1;
};

cron.schedule('59 23 28-31 * *', async () => {
  const now = new Date();
  const isLastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() === now.getDate();
  if (!isLastDay) return;

  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const users = await User.find().select('_id solvedTotal');
  const sortedUsers = users.sort((a, b) => b.solvedTotal - a.solvedTotal);

  for (const user of sortedUsers) {
    const rank = getGlobalRank(user._id, sortedUsers);
    user.monthlyRanks.set(monthKey, rank);
    await user.save();
  }

});