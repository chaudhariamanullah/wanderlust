if (process.env.NODE_ENV != "production"){
    require('dotenv').config()
};
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const listingRouter = require("./routes/listing.js")
const method = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const session = require("express-session")
const MongoStore = require("connect-mongo");
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./modules/user.js")
const { Server } = require("http");

const dbUrl = process.env.ATLASDB_URL;

main().then( ()=>{
    console.log("DB Is Connected.")
}).catch( ()=>{
    console.log("DB Connection Failed.")
})

async function main(){
    await mongoose.connect(dbUrl)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(method("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.json());

const store = MongoStore.create({
    mongoUrl: dbUrl, 
    crypto : {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, 
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});


const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false ,
    saveUninitialized: true,
    cookie :{
        expires: Date.now() * 7 * 24 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 1000
    }
};

app.use(session(sessionOptions))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()))

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

SignUp
app.use((req,res,next)=>{
   res.locals.signup = req.flash("signupSuccess")
  next()
})

app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter)
app.use("/",userRouter)

Wrong Route Error Handlig
app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"Page Not Found!"));
})

// Error Handling
app.use((err, req, res, next) => {
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).send(message);
}); 



// const Mongoose_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.listen(8080, ()=>{
    console.log("Server Is On.")
})

app.get("/",(req,res)=>{
   res.redirect("./listing/index.ejs")
})


