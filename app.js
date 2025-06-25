const express=require('express');
const app=express();
const path =require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listingsRoutes = require('./routes/listings.js'); // Import the listings routes
const routesKeraste=require('./routes/reviews.js'); // Import the reviews routes
const session = require('express-session');
const flash= require('connect-flash'); // Import connect-flash for flash messages

// Set up EJS as the view engine
app.engine('ejs', ejsMate); // Use ejsMate for EJS support
// Set the view engine to EJS


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// app.set('public', path.join(__dirname, 'public'));
// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use(express.json()); // if you also handle JSON
app.use(methodOverride('_method'));
// getting-started.js
const mongoose = require('mongoose');
const Listing = require('./models/listings');

main().then(()=>{
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const sessionOptions = {
    secret:"your_secret_key", // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true, // Helps prevent XSS attacks
    }
}

app.use(session(sessionOptions)); // Use session middleware
app.use(flash()); // Use connect-flash for flash messages

// login signup middlewares
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js'); // Import the User model

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Use the LocalStrategy for authentication
passport.serializeUser(User.serializeUser()); // Serialize user for session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

app.use((req, res, next) => {
    res.locals.success = req.flash('success'); // Make flash messages available in views
    console.log('Flash messages middleware initialized');
    res.locals.error = req.flash('error'); // Make error messages available in views
    res.locals.currentUser = req.user; // Make the current user available in views
    console.log('Current user:', res.locals.currentUser); // Log the current user for debugging
    next();
});





const port=3000;

// routes for login and signup
// app.get('/fakeuser', async (req,res)=>{
//     const user = new User({ email: 'abcdef@gmail.com', username: 'abcdef' }); // Create a new user object with email and username
//     const newUser = await User.register(user, 'password123'); // Register a new user with email and password
//     res.send(newUser);
// });


app.get('/',(req,res)=>{
    res.send('Hello World!');
}
);

// reviews routes
const Review = require('./models/reviews.js');
app.use('/listings/:id',routesKeraste ); // Use the reviews routes with the listing ID as a parameter

// listings routes
app.use('/listings',listingsRoutes ); 

// user routes
const userRoutes = require('./routes/user.js'); // Import the user routes
app.use('/user', userRoutes); // Use the user routes



app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`);
}
);