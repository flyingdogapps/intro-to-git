var express = require("express");
var router = express.Router();
var passport = require("passport");
var Comment = require("../models/comment");
var User = require("../models/user");
/////////////////////////////////////
//Home Route?
/////////////////////////////////////
router.get("/", function(req, res){ 
 
  var k = req.params;

 res.render("landing");

});

 

//=============================================================
//AUTH ROUTES
//show reg form
router.get("/register", function(req,res){
  res.render("register");
});

//handle signup logic
router.post("/register", function(req,res){

  var newUser = new User({username: req.body.username});// creating a new user from the form
  User.register(newUser, req.body.password, function(err,user){//instead of storing password, it hashes it than store it
    if(err){
      console.log(err);
      //show user the error from Passport
      req.flash("error",err.message);
      // req.flash("success", "Welcome to YelpCamp ");
      res.redirect("/register");
    }
    passport.authenticate("local")(req,res, function(){ //once user is signed up, log them in and if no error - redirect to campgrounds
      req.flash("success", "Welcome to YelpCamp "+ user.username);
      res.redirect("/campgrounds")
    });
  }) ;
});


//End of Auth Routes===============================================



//Show Login form
router.get("/login", function(req,res){
  res.render("login");
});

//handling login logic
//add middleware for login auth looks like router.post("/Login", middleware, callback)
router.post("/login", passport.authenticate("local",  //passport.auth is the middleware, using the local stretegy
  {
    successRedirect:"/campgrounds", //if auth is good - go to campgroudns
    failureRedirect:"/login",//if not, go to login
  }), function (req,res) {
})

//logout route
router.get("/logout", function(req,res){
  req.logout();//passport method
  req.flash("success","Logged you out");
  res.redirect("/campgrounds");
});

module.exports = router;