const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        set: (v) => {
            return v === ""
                ? "https://images.unsplash.com/photo-1744137285276-57ca4048f805?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                : v;
        },
        default: 'https://images.unsplash.com/photo-1744137285276-57ca4048f805?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// middleware to cascade delete reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        const Review = require('./reviews'); // Import the Review model
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;