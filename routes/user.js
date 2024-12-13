const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js");
const userControllers = require("../controllers/user.js");


//sigup 
router
  .route("/signup")
  .get(userControllers.rendersignupForm)
  .post(wrapAsync(userControllers.signup));

router
   .route("/login")
   .get(userControllers.renderLoginForm)
   .post(saveRedirectUrl , passport.authenticate("local", {failureRedirect:"/login",failureFlash:true,})
        ,(userControllers.login));

router.get("/logout",userControllers.logout)


module.exports = router;