var express = require("express");
var router = express.Router({mergeParams: true}); //merge allows to access params from campgrounds
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");//doesnt need to be /index,js beacuse index is speacial


//******************************************* */
//         Comments New                   //
//******************************************* */

router.get("/new",middleware.isLoggedIn,function(req,res){ //added is loggedIn middleware to reroute to login if not logged in
  Campground.findById(req.params.id,function(err,campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new",{campground:campground});
    }
  })
}); //end of comment get

//CREATE	/campgrounds/:id/comments	POST	Add new dog to db, then redirect somewhere

router.post("/", middleware.isLoggedIn, function(req, res){ //added is loggedIn middleware to reroute to login if not logged in
//lookup campground using ID
  Campground.findById(req.params.id, function(err,campground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else{
      Comment.create(req.body.comment, function(err,comment){
        if(err){
          console.log(err);
        } else{
          
          //add username and ID to comment
          comment.author.id = req.user._id; //grab id and username from req.user which we have because the middleware function inside of app.js...  res.locals.currentUser = req.user;
          comment.author.username = req.user.username;
          //connect new comment to campground
          //redirect to campground show page
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log(comment);
          req.flash("success","Successfully added comment");
          res.redirect("/campgrounds/" + campground._id);
        }
      })
      // console.log(req.body.comment);
      //create new comment 
    }
  });
});
//******************************************* */
//         Comments Edit                      //
//******************************************* */
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){ //needs to be :comment_id instead of just :id because :id is used for campground alreaedy
  Comment.findById(req.params.comment_id,function(err, foundComment){
    if(err){
      res.redirect("back");
    }else{
      //req.params.id is a *global* thing from an app.use in app.js

      res.render("comments/edit",{campground_id: req.params.id, comment: foundComment});
    }
  });
});


//******************************************* */
//         Comments Update                    //
//******************************************* */
router.put("/:comment_id",middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err, updatedComment){
    if(err){
      res.redirect("back");
    } else{
      req.flash("success","Successfully updated comment");
      res.redirect("/campgrounds/" + req.params.id); //redirect to updated page
    }
  });
// redirect
});

//******************************************* */
//         Comments Destroy                    //
//******************************************* */
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err){
      res.redirect("back");
    } else{
      req.flash("success","Comment removed");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});



 


module.exports = router;