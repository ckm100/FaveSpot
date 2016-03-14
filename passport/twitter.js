var TwitterStrategy = require("passport-twitter").Strategy;

module.exports = function (passport, User) {

    passport.use(new TwitterStrategy({
            consumerKey: "9ogHF3yFMbCcmU3tTi8ZxrRaF",
            consumerSecret: "V0n6cniUKxElHnVvjRixHLP3PtTluQxmYMQ0R28Lj7FOYJstHs",
            callbackURL: "http://favespot.heroku.com/auth/twitter/callback"
        },
        function (token, tokenSecret, profile, done) {

            User.findOne({
                twitterId: profile.id
            }, function (err, user) {
                if (err) {
                    return done(err);
                } else {

                    if (user) {
                        done(null, user);
                    } else {

                        var user = new User({
                            uname: profile.displayName.split(" ")[0],
                            twitterId: profile.id
                        });

                        user.save(function (err, data) {

                            if (err) {
                                return done(err)
                            } else {
                                return done(null, user);
                            }

                        });
                    }
                }

            });
        }
    ));

}
