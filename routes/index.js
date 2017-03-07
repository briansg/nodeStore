var express = require('express');
var passport = require('passport');
var router = express.Router();
var Users = require('../models/Users');

/* GET home page.  TBD*/
router.get('/', function(req, res, next) {
  res.redirect('login');
});

/** Registration form */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Signup', user: req.user });
});
/** Process registration form */
router.post('/register', function(req, res, next) {
  var newUser = new Users({ username: req.body.username });
  Users.register(newUser, req.body.password, function (err, user) {
    if (err) return res.send('Error: Registering user ' + newUser.username + ': ' , err);
    res.redirect('login');
  });
});
/** Login form */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'User login', user: req.user });
});
/** Process login form */
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
}), function(req, res) {
  res.redirect('/products');
});
/** Logout action */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
