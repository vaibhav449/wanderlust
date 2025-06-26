const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model
const passport = require('passport');
const {checkAuthentication,setRedirection} = require('../middleware.js'); // Import the authentication middleware
const { set } = require('mongoose');


router.get("/signup", (req, res) => {
    res.render("user/signup.ejs"); // Render the signup form
});
router.get("/login", (req, res) => {
    res.render("user/login.ejs"); // Render the login form
});
router.post(
  '/login',setRedirection,
  passport.authenticate('local', {
    failureRedirect: '/user/login',
    failureFlash: true,
  }),
  (req, res) => {
    // Successful login
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.redirectUrl || '/listings';
    console.log('Redirecting to:', redirectUrl); // Log the redirect URL for debugging
    
    try {
        res.redirect(redirectUrl);

    } catch(error) {

        res.redirect('/listings'); // Fallback redirect if an error occurs
  }
}
);



router.post("/signup", async (req, res) => {
    // console.log('Received signup request:', req.body); // Log the request body for debugging
    const { email, username, password } = req.body; // Destructure the request body
    try {
        const user = new User({ email, username }); // Create a new user object 
        const newUser = await User.register(user, password); // Register the user with the provided password
        console.log('User registered successfully:', newUser); // Log the newly registered user
        req.flash('success', 'User registered successfully!'); // Flash success message
        req.logIn(newUser, (err) => { // Log in the user after registration
            if (err) {
                console.error('Error logging in user:', err); // Log any error during login
                req.flash('error', 'Failed to log in after registration.'); // Flash error message
                return res.redirect('/user/login'); // Redirect to login page
            }
            res.redirect('/listings'); // Redirect to listings page after successful login
        });
    } catch (error) {   
        console.error('Error registering user:', error); // Log the error
        req.flash('error', 'Failed to register user.'); // Flash error message
        res.redirect('/user/signup'); // Redirect back to the signup page
    }
});
router.get('/logout', checkAuthentication,setRedirection,(req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Internal Server Error');
        }
        req.flash('success', 'You have been logged out successfully.');
        res.redirect('/listings'); // Redirect to the login page after logout
    });
});

module.exports = router;