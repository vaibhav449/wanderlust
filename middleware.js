const checkAuthentication = (req, res, next) => {
    if ( !req.isAuthenticated()) {
        if (req.session) {
            req.session.returnTo = req.originalUrl;
            console.log(req.session.returnTo);
        }
        req.flash('error', 'You must be logged in to perform this action.');
        return res.redirect('/user/login');
    }
    next();
};

const setRedirection = (req, res, next) => {
  const returnTo = req.session.returnTo;

  if (returnTo) {
    // Match:
    // 1) POST to /listings/:id/reviews
    // 2) DELETE (via _method) /listings/:id/reviews/:reviewId
    const reviewPostMatch = returnTo.match(/^\/listings\/([^\/]+)\/reviews$/);
    const reviewDeleteMatch = returnTo.match(
      /^\/listings\/([^\/]+)\/reviews\/[^\/]+(?:\?.*)?$/
    );

    if (reviewPostMatch) {
      // /listings/:id/reviews → /listings/:id
      const listingId = reviewPostMatch[1];
      res.locals.redirectUrl = `/listings/${listingId}`;
      console.log('Review-POST path detected, redirecting to listing:', res.locals.redirectUrl);

    } else if (reviewDeleteMatch) {
      // /listings/:id/reviews/:reviewId[?...] → /listings/:id
      const listingId = reviewDeleteMatch[1];
      res.locals.redirectUrl = `/listings/${listingId}`;
      console.log('Review-DELETE path detected, redirecting to listing:', res.locals.redirectUrl);

    } else {
      // Any other saved URL
      res.locals.redirectUrl = returnTo;
      console.log('Setting redirection URL to:', res.locals.redirectUrl);
    }
  }

  next();
};



const isOwner = async (req, res, next) => {
    try {
        const listingId = req.params.id;
        const Listing = require('./models/listings'); // Import here to avoid circular dependency
        const listing = await Listing.findById(listingId);
        if (!listing) {
            req.flash('error', 'Listing not found.');
            return res.redirect('/listings');
        }
        console.log('Listing found:', listing);
        // Compare the listing's owner to the logged-in user
        if (listing.owner._id.equals(req.user._id)) {
            return next();
        }
        req.flash('error', 'You do not have permission to perform this action.');
        res.redirect(`/listings/${listingId}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong.');
        res.redirect(`/listings/${req.params.id}`);
    }
};
module.exports = {
    checkAuthentication,
    setRedirection,
    isOwner
};
