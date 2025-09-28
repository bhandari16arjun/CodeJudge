require('../config/passport'); 
const express = require('express');
const passport = require('passport');
const router = express.Router();
const googleController = require('../controllers/googleController');

router.get('/', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  googleController.googleAuthCallback
);

module.exports = router;
