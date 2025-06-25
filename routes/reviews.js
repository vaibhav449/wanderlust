const express = require('express');
const router = express.Router({mergeParams: true}); // Merge params to access listing ID in review routes
const Review = require('../models/reviews');
const Listing = require('../models/listings');


router.post('/reviews', async (req, res) => {
    const id = req.params.id;
    const { comment, rating } = req.body;
    console.log("this is comment",comment, rating);
    try {
        const newReview = new Review({
            rating,
            comment
        });
        await newReview.save();
        req.flash('success', 'Review added successfully!');
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send('Listing not found');
        }
        listing.reviews.push(newReview._id);
        await listing.save();
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/reviews/:reviewId', async (req, res) => {
    console.log('Deleting review');
    const { id, reviewId } = req.params;
    console.log('Listing ID:', id, 'Review ID:', reviewId);
    try {
       // delete using pull oerator
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Review deleted successfully!');
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;