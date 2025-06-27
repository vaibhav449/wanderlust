const Listing = require('../models/listings.js'); // Import the Listing model
const { checkAuthentication, setRedirection, isOwner } = require('../middleware.js'); // Import the authentication middleware
module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find();
    res.render('listings',{allListings});
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('Internal Server Error');
  }
};
module.exports.newListing =(req, res) => {
    // Render the form to add a new listing
    console.log('Rendering addListing form');
    res.render('addListing');
};
module.exports.show = async (req, res) => {
  const id = req.params.id;
  try {
    const listing = await Listing.findById(id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author', // Populate the author field in reviews
          select: 'username' // Populate the username field from the User model
        }
      }).populate({
        path: 'owner',
      })
      .exec();
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    // console.log('Listing found:', listing);
    // console.log("User : ", res.locals.currentUser);
    // Now listing.reviews is an array of review objects, not just ObjectIds
    res.render('showListing', { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
module.exports.updateListing = async (req, res) => {
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
};
module.exports.edit= (req,res)=>{
    const id=req.params.id;
    const reqListing = Listing.findById(id);
    reqListing.then((listing)=>{
        res.render('editListing',{listing});
    }).catch((err)=>{
        console.log(err);
        res.status(404).send('Listing not found');
    });
};
