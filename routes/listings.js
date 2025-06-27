const express=require('express');
const router=express.Router();
const Listing = require('../models/listings');  
const {checkAuthentication,setRedirection,isOwner} = require('../middleware.js'); // Import the authentication middleware
const controllers = require('../controllers/listing.js');


// shows the form to add a new listing
router.get('/new',checkAuthentication,controllers.newListing);
//shows all listings
router.get('/',controllers.index); 
// shows listing
router.get('/:id' , controllers.show); 

// put method to update a listing
router.put('/:id', checkAuthentication,isOwner,controllers.updateListing);
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
router.get('/:id/edit',checkAuthentication,isOwner,controllers.edit);
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