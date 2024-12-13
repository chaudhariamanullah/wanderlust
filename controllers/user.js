const User = require("../modules/user.js");

module.exports.rendersignupForm = (req,res)=>{
    res.render("./user/signup.ejs")
};

module.exports.signup = async(req,res)=>{
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser)
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("signupSuccess","Registered Successfully")
            res.redirect("/listing");
        })
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
   
};


module.exports.renderLoginForm =  (req,res)=>{
    res.render("user/login.ejs")
}

module.exports.login = async(req,res)=>{
    req.flash("signupSuccess","Login Successful");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};


module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Are loggedOut")
        res.redirect("/listing")
    });
};