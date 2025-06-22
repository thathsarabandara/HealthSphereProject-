const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth/AuthController');

const router = express.Router();

// Google OAuth
router.get('/google', (req, res, next) => {
  const group = req.query.group ;
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false ,
    state: group,
  })(req, res, next);
});

router.get('/google/callback',(req, res, next) => {
    const group = req.query.state;
    req.query.group = group;
    next();
  },passport.authenticate('google', { session:false, failureRedirect: '/login' }), authController.googleCallback);


module.exports = router;