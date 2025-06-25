const mongoose= require('mongoose');
const Schema= mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
    },
});

UserSchema.plugin(passportLocalMongoose); // Adds username and password fields, and methods for authentication

module.exports = mongoose.model('User', UserSchema); // Export the User model
// This model can be used to create and manage user accounts, including registration and authentication.