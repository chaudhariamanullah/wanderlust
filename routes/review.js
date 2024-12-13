const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const Listing = require("../modules/listing.js");
const reviewControllers = require("../controllers/review.js");

//Posting Review
router.post("",isLoggedIn,validateReview, wrapAsync(reviewControllers.createReview));

 //Delete Review

 router.delete("/:review" ,isLoggedIn, isReviewAuthor,
    wrapAsync(reviewControllers.destroyReview))

 module.exports = router;