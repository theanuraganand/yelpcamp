var express         = require('express'),
    app             = express(),
    mongoose        = require('mongoose'),
    faker           = require('faker'),
    bodyParser      = require('body-parser'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local');
    Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    User            = require('./models/users'),
    seedDB          = require('./seeds');

//seedDB();

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

var port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extend:true}));

// Passport Configuration
app.use(require('express-session')({
    secret: "Trisha is half crack!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middle ware for user data
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use("/",indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var svgCaptcha = require('svg-captcha');

app.get('/captcha', function (req, res) {
    var captcha = svgCaptcha.create();
    req.session.captcha = captcha.text;
    console.log(captcha.text);
    res.type('svg');
    res.status(200).send(captcha.data);
});

app.listen(port, function (error) {
    if(!error)
        console.log("Server Started");
    else
        console.log(error);
});