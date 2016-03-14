var express = require("express"),
    path = require("path"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    session = require("express-session"),
    routes = require("./app/routes/route"),
    passportLogic = require("./passport/index"),
    flash = require("connect-flash"),
    app = express(),
    yelp = require("./app/yelp"),
    User = require("./model/user"),
    Location = require("./model/location"),
    localDb = "mongodb://127.0.0.1:27017/favespot";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("port", (process.env.PORT || 9000));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    secret: "fuck you",
    resave: true,
    saveUninitialized: true

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoose.connect(process.env.MONGOLAB_URI || localDb);

passportLogic(User);

routes(app, passport, User, yelp, Location);

app.listen(app.get("port"), function () {

    console.log("Listening to port " + app.get("port"));

});
