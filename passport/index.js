var passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    pLoginLogic = require("./login"),
    pSignUpLogic = require("./signup"),
    pTwitterLogic = require("./twitter");

module.exports = function (User, app, bodyParser) {

    pLoginLogic(passport, LocalStrategy, User);

    pSignUpLogic(passport, LocalStrategy, User);

    pTwitterLogic(passport, User);

    passport.serializeUser(function (user, done) {

        done(null, user._id);

    });

    passport.deserializeUser(function (id, done) {

        User.findById(id, function (err, user) {

            done(err, user);

        });

    });

}
