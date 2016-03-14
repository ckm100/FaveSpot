var TwitterStrategy = require("passport-twitter").Strategy;

module.exports = function (passport, User) {

    passport.use(new TwitterStrategy({
            consumerKey: "A5eRq9Qm3Crs7Ztqrhlk2nn17",
            consumerSecret: "zsKLmvpjI6ZdTuAvKWJ1U98Kq5leeeF3Ztb64uKPPawpc7B1St",
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
                            twitterId: profile.id,
                            lastSearch: ""
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
