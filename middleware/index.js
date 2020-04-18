var Campground = require("../models/campground");
var Comment = require("../models/comment");


//all the middleware goes here
var middlewareObj = {}; //defining the obj first than add functions


//are you logged in - if so, is it your campground?
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  //is user logged in?
  if(req.isAuthenticated()){
    var campToShow =  req.params.id;
    Campground.findById(req.params.id, function(err,foundCampground){
      if(err){ //couldn't find campground 
        req.flash("error", "Campground not found");
        res.redirect("back");//"back" means you go back to the previous page?
      } else{
      //does user own campground
        if(foundCampground.author.id.equals(req.user._id)){ //can't do a === from author.ic and user._id because one is an object. use id.equals() by mongo to compare
        next();//ok, you are good to continue
        } else{
        // console.log("You need to be logged in to do that");
        req.flash("error", "You don't have permission to do that");
        res.redirect("back");//"back" means you go back to the previous page?
        }
      }
    });
  }else{
    req.flash("error", "You need to be logged in to do that");
    res.redirect("back");//"back" because not logged in
  }
}
//are you logged in - if so, is it your comment?
middlewareObj.checkCommentOwnership = function(req, res, next){
  //is user logged in?
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err,foundComment){
      if(err){
        res.redirect("back");//"back" means you go back to the previous page?
      } else{
      //does user own comment
        if(foundComment.author.id.equals(req.user._id)){ //can't do a === from author.ic and user._id because one is an object. use id.equals() by mongo to compare
        next();//ok, you are good to continue
        } else{
        res.redirect("back");//"back" means you go back to the previous page?
        }
      }
    });
  }else{
    res.redirect("back");//"back" means you go back to the previous page?
  }
}

//isLoggedIn - if user is logged in, continue, otherwise - redirect to login
middlewareObj.isLoggedIn = function (req,res,next){
  if(req.isAuthenticated()){
    req.flash("success","You are logged in")
    return next();
  }
  //The flash code is taking "Please Login" part, add it to the flash but won't be seen till the next thing we see.

  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
}



module.exports = middlewareObj;