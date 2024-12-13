const Review = require("../modules/review.js");
const Listing = require("../modules/listing.js"); 

module.exports.createReview = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("revAdd","Review Added");
    res.redirect(`/listing/${id}`)
 };


 module.exports.destroyReview =  async(req,res)=>{
    let {id , review} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews : review}})
    await Review.findByIdAndDelete(review);
    req.flash("revDel","Review Deleted")
    res.redirect(`/listing/${id}`)
 };

