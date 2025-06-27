const express = require('express');
const router = express.Router({mergeParams: true}); // Merge params to access listing ID in review routes
const Review = require('../models/reviews');
const Listing = require('../models/listings');
const { checkAuthentication, setRedirection, isOwner } = require('../middleware');
const reviewsController = require('../controllers/reviews');


router.post('/reviews',checkAuthentication,reviewsController.postReview);

router.delete('/reviews/:reviewId',checkAuthentication,reviewsController.authenticateReview ,reviewsController.deleteReview);

module.exports = router;