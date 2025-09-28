const jwt = require('jsonwebtoken');
const User = require('../models/users');
const cookieOpts = { httpOnly: true, sameSite: 'Lax', secure: false, path: '/', maxAge: 86400000 };

exports.googleAuthCallback = (req, res) => {
  const { _id, email } = req.user;
  const token = jwt.sign({ id: _id, email }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, cookieOpts);
  res.redirect(`${process.env.CLIENT_URL}/dashboard`);
};
