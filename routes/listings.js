const express=require('express');
const router=express.Router();
const Listing = require('../models/listings');  
const {checkAuthentication,setRedirection,isOwner} = require('../middleware.js'); // Import the authentication middleware
//shows all listings
router.get('/', async (req, res) => {
  try {
    const allListings = await Listing.find();
    res.render('listings',{allListings});
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('Internal Server Error');
  }
});
// shows the form to add a new listing
router.get('/new',checkAuthentication,setRedirection ,(req, res) => {
    // Render the form to add a new listing
    console.log('Rendering addListing form');
    res.render('addListing');
});
// shows listings
router.get('/:id' , async (req, res) => {
  const id = req.params.id;
  try {
    const listing = await Listing.findById(id)
      .populate({
        path: 'reviews',
      }).populate({
        path: 'owner',
      })
      .exec();
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    console.log('Listing found:', listing);
    console.log("User : ", res.locals.currentUser);
    // Now listing.reviews is an array of review objects, not just ObjectIds
    res.render('showListing', { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// put method to update a listing
router.put('/:id', checkAuthentication,setRedirection,isOwner ,async (req, res) => {
    const id = req.params.id;
    const { name, description, image, price, location, country } = req.body;
    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { name, description, image, price, location, country },
            { new: true }
        );
        if (!updatedListing) {
            return res.status(404).send('Listing not found');
        }
        req.flash('success', 'Listing updated successfully!');
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error('Error updating listing:', error);
        res.status(500).send('Internal Server Error');
    }
}
);
// handles the form submission to add a new listing
router.post('/',checkAuthentication,setRedirection,async(req,res)=>{
    console.log('Received form submission for new listing');
    const { name, description, image, price, location, country } = req.body;
    const newListing = new Listing({
        name,
        description,
        image,
        price,
        location,
        country
    });
    newListing.owner = req.user._id; // Set the owner to the currently logged-in user
    try {
        await newListing.save();
        req.flash('success', 'Listing added successfully!');
        res.redirect('/listings');
    } catch (error) {
        console.error('Error saving listing:', error);
        res.status(500).send('Internal Server Error');
    }
});
// handles the form submission to edit a listing
router.get('/:id/edit',checkAuthentication,setRedirection,isOwner,(req,res)=>{
    const id=req.params.id;
    const reqListing = Listing.findById(id);
    reqListing.then((listing)=>{
        res.render('editListing',{listing});
    }).catch((err)=>{
        console.log(err);
        res.status(404).send('Listing not found');
    });
});
// delete a listing
router.delete('/:id', checkAuthentication,setRedirection,isOwner,async (req, res) => {
    const id = req.params.id;
    try {
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            return res.status(404).send('Listing not found');
        }
        req.flash('success', 'Listing deleted successfully!');
        res.redirect('/listings');
    } catch (error) {
        console.error('Error deleting listing:', error);
        res.status(500).send('Internal Server Error');
    }
}
);
module.exports = router;