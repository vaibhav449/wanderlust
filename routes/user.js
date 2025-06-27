const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model
const passport = require('passport');
const {checkAuthentication,setRedirection} = require('../middleware.js'); // Import the authentication middleware
const { set } = require('mongoose');
const userController = require('../controllers/user.js'); // Import user controller
const user = require('../models/user');


router.get("/signup",userController.getSignUp); // Render the signup form);

router.get("/login",userController.getLogin); // Render the login form


router.post(
  '/login',setRedirection,
  passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: true,
  }), userController.postLogin );



router.post("/signup",userController.postSignUp); // Handle signup form submission

router.get('/logout', checkAuthentication,setRedirection,userController.logout); // Handle logout

module.exports = router;