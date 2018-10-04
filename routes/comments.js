var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');

// Form for new comment
router.get("/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if(err)
            console.log(err)
        else{
            // console.log("\n Error start \n" + campground)
            res.render("comments/new", {campground: campground});
        }
    });
    //res.render("comments/new");
});

// New comment
router.post("/", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function (err, comment) {
                if(err)
                    console.log(err)
                else{
                    //console.log("\n New Comemnt with the id: " + req.user.username + req.user._id);
                    // Associate user with the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save the comment
                    comment.save();
                    // Associate the comment to the campground
                    campground.comments.push(comment);
                    campground.save();
                    // console.log(campground);
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
            // console.log(req.body.comment);
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