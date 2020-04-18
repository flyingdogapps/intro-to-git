var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
// var Comment = require("../models/comment"); //v10 colt doesn't have it?!
var middleware = require("../middleware");//doesnt need to be /index,js beacuse index is speacial


////////////////////////////////////////
//INDEX route - show all campgrounds
////////////////////////////////////////
router.get("/", function(req, res){ 
  //Get all campgrounds from DB
  //get all cats log each one
    Campground.find({},function(err, allCampgrounds){ //finding all the cats. call backs for error and success
    if (err){
      console.log("\noh no error");
      console.log(err);
    } else{
      res.render("campgrounds/index",{campgrounds:allCampgrounds}); //allCampgrounds from db, currentUser from passport
    }
  });
});//end of app get

///////////////////////////////////////////
//NEW Route - show form to add new campsite
///////////////////////////////////////////
//v9 added middleware.isLoggedIn to only allow a new campground to be created if useris loggedin
router.get("/new", middleware.isLoggedIn, function(req, res){ 
 res.render("campgrounds/new");
});







///////////////////////////////////////////
//Create Route - add new campground to db
////////////////////////////////////////////
//v9 added middleware.isLoggedIn to only allow a new campground to be created if useris loggedin
router.post("/",middleware.isLoggedIn, function(req, res){ //to folow REST convention, 

  var name = req.body.name
  var image = req.body.image
  var price = req.body.price
  var description = req.body.description
//v9 added author to the schema, get it's info from req.user which will always be available because it has to be logged in to do this
  var author = {
    id: req.user._id,
    username: req.user.username
  }  
  var newCampground = {name: name, price: price, image: image, description: description, author: author}

  //create a new campground and save to db
    Campground.create(
      newCampground
      , function(err,campground){
        if(err){
          console.log(err);
        }else{
          //redirect to campground page
          console.log("Newly created campground: ");
          res.redirect("/campgrounds");
        }
      });
  });



  ///////////////////////////////////////////
//SHOW Route - show specific campground with more info- this should be on bottom of file
///////////////////////////////////////////
router.get("/:id", function(req, res){ 
  //find campground with given id
  //render show template with that campground
   var campToShow =  req.params.id;
   //bellow - find a camp ground, populating the comments, and .exec to render
   Campground.findById(req.params.id).populate("comments").exec(function(err, justThisCampground){ 
    if (err){
      console.log("\noh no error");
      console.log(err);
    } else{
      // console.log("Now showing camp # " + justThisCampground);
      res.render("campgrounds/show",{campground: justThisCampground});
    }
  });

});
//EDIT Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findById(req.params.id, function(err,foundCampground){
    res.render("campgrounds/edit",{campground: foundCampground});//passing the campground so we know what to update
  });
});
//UPDate Campground route
router.put("/:id" ,middleware.checkCampgroundOwnership, function(req,res){
  //find and update the correct campgroudn
  // findByID takes ID, data and callback.active
  // the data is coming from edit.ejs's campground object 
  Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    } else{
      res.redirect("/campgrounds/" + req.params.id); //redirect to updated page
    }
  });
// redirect
});

//Delete Campground route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
  //find and update the correct campgroudn
  // findByID takes ID, data and callback.active
  // the data is coming from edit.ejs's campground object 
  Campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/campgrounds/" + req.params.id); //redirect to undeleted page
    } else{
      res.redirect("/campgrounds");
    }
  });

});




module.exports = router;