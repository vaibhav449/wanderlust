const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const reviewSchema=new Schema({

    comment: {
        type: String,
        maxlength: 500 // Optional: Limit the length of the comment
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating
        max: 5  // Maximum rating
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
});

module.exports = mongoose.model('Review', reviewSchema);