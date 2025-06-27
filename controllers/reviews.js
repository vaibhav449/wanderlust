const Listing = require('../models/listings');
const Review = require('../models/reviews');

module.exports.postReview = async (req, res) => {
    console.log('Adding review');
    const id = req.params.id;
    const { comment, rating } = req.body;
    console.log("this is comment",comment, rating);
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send('Listing not found');
        }
        const user = res.locals.currentUser; // Get the current user from locals
        if (!user) {
            return res.status(403).send('You must be logged in to add a review');
        }
        const userID= user._id; // Get the user ID from the current user
        console.log('User ID:', userID);
        const newReview = new Review({
            rating:rating,
            comment:comment,
            author: userID, // Set the author to the current user's ID
        });
        await newReview.save();
        req.flash('success', 'Review added successfully!');
        listing.reviews.push(newReview._id);
        await listing.save();
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.deleteReview =  async(req,res,next)=>{
    const reviewId = req.params.reviewId;
    const review= await Review.findById(reviewId);
    if (!review) {
        return res.status(404).send('Review not found');
    }
    if (!review.author.equals(req.user._id)) {
         req.flash('error','You do not have permission to delete this review');
         return res.redirect(`/listings/${req.params.id}`);
    }
    console.log('Review found:', review);
    next();
} ,async (req, res) => {
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
};

module.exports.authenticateReview =  async(req,res,next)=>{
    const reviewId = req.params.reviewId;
    const review= await Review.findById(reviewId);
    if (!review) {
        return res.status(404).send('Review not found');
    }
    if (!review.author.equals(req.user._id)) {
         req.flash('error','You do not have permission to delete this review');
         return res.redirect(`/listings/${req.params.id}`);
    }
    console.log('Review found:', review);
    next();
};

module.exports.deleteReview= async (req, res) => {
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
};