var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");

// Display all route
router.get("/", function (req, res) {
    // console.log(req.user);
    Campground.find({}, function (err, campgrounds) {
        if (err)
            console.log(err)
        else
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user});
    });
});

// Add new campground route
router.post("/", isLoggedIn, function (req, res) {
    var  name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: description, author: author};
    // Create new Campground to DB
    Campground.create(newCampground, function(err, campground) {
        if(err)
            console.log(err)
        else
            console.log()
    });
    res.redirect("/campgrounds");
});

// form for adding an new campground
router.get("/new", isLoggedIn, function (req, res) {
    // console.log("New campgroud");
    res.render("campgrounds/new", {});
});

// Shows a single campground
router.get("/:id", function (req, res) {
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function (err, campground) {
        if (err)
            console.log(err)
        else{
            // console.log(campground);
            res.render("campgrounds/show", {campground: campground});
        }

    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;