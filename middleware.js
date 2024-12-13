const Listing = require("./modules/listing.js");
const Review = require("./modules/review.js");
const {listingSchema, reviewSchema} = require("./schemaValidation.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You Must LogIn before posting Anything.")
        return res.redirect("/login") 
    }
    next();
}
   
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't Have The Permission To Make Changes.")
        return res.redirect(`/listing/${id}`);
    }
    next();
};


module.exports.validateListing = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400,errMsg); // Passing errMsg instead of error
    } else {
        next();
    }
};



module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg); // Passing errMsg instead of error
    } else {
        next();
    }
};


module.exports.isReviewAuthor= async (req, res, next) => {
    let {id, review } = req.params;
    let reviews = await Review.findById(review);
    if(!reviews.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Only the Author have permission to Delete review!! ");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

