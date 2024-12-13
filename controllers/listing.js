const Listing = require("../modules/listing.js");


module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listing/index.ejs",{allListings});
};

module.exports.newListing = (req,res)=>{
    res.render("listing/new.ejs")
};

module.exports.showListing = async (req,res)=>{  
        let { id } = req.params;
        const listing = await Listing.findById(id)
        .populate({
            path: "reviews" , 
            populate:{ path:"author"}})
            .populate("owner");

        if (!listing) {
            req.flash("notExist", "This Listing Does Not Exist");
            return res.redirect("/listing");
        }
        res.render("listing/show",{listing});
};


module.exports.createListing = async (req,res,next)=>{
    const { latitude, longitude } = req.body.listing;
    console.log(latitude)
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    console.log(url,filename);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.coordinates = {latitude, longitude};
    await newListing.save();
    req.flash("success","New Listing Created Succesfully.");
    res.redirect("/listing")  
};

module.exports.renderEditForm = async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "listing you requested for does not exist")
        res.redirect("/listings");
    }

    let originalImage = listing.image.url;
    originalImage.replace("/upload","/upload/h_300,w_250")
    res.render("listing/edit.ejs",{listing})
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
    if (typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated.")
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("Del","Listing Deleted Succesfully");
    res.redirect("/listing")
}