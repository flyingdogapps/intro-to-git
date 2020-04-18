var express           = require ("express"), //enable express
    app               = express(), //init express
    request           = require ("request"), //enabale request (not sure if i'm using it)
    bodyParser        = require("body-parser"), //enable body-parser 
    mongoose          = require("mongoose"),//enable mongoose
    methodOverride    = require("method-override"),//for overriding POST requests
    flash             = require("connect-flash"), //to use seedsDB();
    Campground        = require("./models/campground"), //using campground schema from the models folder
    Comment           = require("./models/comment"), //same as campgoround for comments
    User              = require("./models/user"), // for log in stuff
    passport          = require("passport"),//JS auth
    seedDB            = require("./seeds"), //to use seedsDB();
    LocalStrategy     = require("passport-local");//JS auth strategy

//requiring routes (they are now in /routes)
var commentRoutes    = require("./routes/comments"), //using comments routes from the routes folder
    campgroundRoutes = require("./routes/campgrounds"), //using campgrounds routes from the routes folder
    indexRoutes       = require("./routes/index"); //using auth routes from the routes folder



mongoose.connect("mongodb://localhost:27017/yelp_camp_v11", {useNewUrlParser: true, useUnifiedTopology: true}); //use (or create) yelp_camp db

app.use(bodyParser.urlencoded({extended:true})); //not sure if i'm using it
app.use(express.static("public")); //so public is part of the path
app.set("view engine", "ejs"); // so ejs extentinos are accepted like home instead of home .ejs
app.use(express.static(__dirname+"/public"))//__dirname gives path for this file. The rest makes public globel
app.use(methodOverride("_method"));//to use method
app.use(flash());//to use flash THIS MUST BE ABOVE PASSPORT, needs to use Express-session




//******************************************* */
//          Actual app starts here            //
//******************************************* */

//v8 don't seed
//seedDB();//empty the db and add some hard code stuff in there

//AUTH Passport config =====================================================================

//This code must be below var app = express();
app.use(require("express-session")({//require and use in a single line, and excute with some options
  secret:"Will i stay busy with paysheet?",//will be used to encode and decode inside the session, 
  resave: false,//required, not sure what it does
  saveUninitialized: false,  //required, not sure what it does
}));

app.use(passport.initialize()); //Need those two anytime using passport
app.use(passport.session()); //Need those two anytime using passport
passport.use(new LocalStrategy(User.authenticate()));//create a new local stratgey using the User.auth method that's coming from passport-local-mongoose
passport.serializeUser(User.serializeUser());//encoding it and putting it back in the session
passport.deserializeUser(User.deserializeUser());//taking data from session and decode it


//This must be bellow passport stuff
//this is custom made middleware, it is called on every route
app.use(function (req,res,next){
  //whatever we put in res.lcoals is avilable inside the template
  //Mainly, we have access to the currentUser in each template
  res.locals.currentUser = req.user;
  //v11 - Adding message for flash. Think about it as globals in C or public in VBA
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next(); // is a must otherwise the middleware will halt the code
});

//short cuts for routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


////////////////
//Run the app  
///////////////
app.listen(3000,()=>{
  var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var path = process.cwd().split('/').pop();
console.log("listening on 3000\n" + time + "\nRunning: " + path +"\n");
});
