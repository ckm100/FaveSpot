module.exports = function (app, passport, User, yelp, Location) {

    var searchBeforeTwitterLogin = "";

    app.get("/logout", function (req, res) {

        req.logout();

        res.redirect("/");

    });

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get("/auth/twitter/callback", function (req, res, next) {

        passport.authenticate("twitter", function (err, user, info) {

            if (err) {

                res.end("Something went wrong please try logging in again, if problem persist you can please contact me at kufogbemawuli1@gmail.com");
            }

            if (!user) {

                res.end("Something went wrong please try logging in again, if problem persist you can please contact me at kufogbemawuli1@gmail.com");

            } else {

                req.login(user, function (err) {

                    if (err) {

                        res.end("Something went wrong please try logging in again, if problem persist you can please contact me at kufogbemawuli1@gmail.com");

                    } else {

                        if (req.isAuthenticated()) {

                            User.findOne({
                                _id: req.user._id
                            }, function (err, doc) {

                                if (err) {

                                    res.end("Something went wrong please try logging in again, if problem persist you can please contact me at kufogbemawuli1@gmail.com");

                                } else {

                                    if (doc.lastSearch !== "" && searchBeforeTwitterLogin === "") {

                                        res.redirect("/");

                                    } else if (doc.lastSearch === "" && searchBeforeTwitterLogin === "") {

                                        res.redirect("/");

                                    } else if (doc.lastSearch === "" && searchBeforeTwitterLogin !== "") {

                                        doc.lastSearch = searchBeforeTwitterLogin;

                                        doc.save(function (err) {

                                            if (err) {

                                                res.end("Something went wrong please try logging in again, if problem persist you can please contact me at kufogbemawuli1@gmail.com");

                                            } else {

                                                res.redirect("/");
                                            }

                                        });
                                    }
                                }

                            });

                        }

                    }

                });
            }

        })(req, res, next);

    });


    app.post("/location", function (req, res) {

        searchBeforeTwitterLogin = req.body.location;

        Location.findOne({

            location: req.body.location

        }, function (err, data) {

            if (err) {
                return err;
            } else {

                if (data) {

                    if (req.isAuthenticated()) {

                        User.findOne({
                            _id: req.user._id
                        }, function (err, doc) {

                            if (err) {

                                return err;

                            } else {

                                doc.lastSearch = req.body.location;

                                doc.save(function (err) {

                                    if (err) {

                                        return err;

                                    } else {

                                        res.render("location", {
                                            data: data.bars,
                                            searchByApi: false,
                                            userId: req.user._id,
                                            isAuth: true,
                                            usersGoing: req.user.usersGoing

                                        });

                                    }

                                });

                            }

                        });

                    } else {

                        res.render("location", {
                            data: data.bars,
                            searchByApi: false,
                            isAuth: false

                        });

                    }

                } else {

                    yelp.search({
                        category_filter: "bars",
                        location: req.body.location
                    }).then(function (data) {
                        var location = new Location({
                            location: req.body.location,
                            bars: []
                        })

                        data.businesses.forEach(function (val) {

                            location.bars.push({
                                id: val.id,
                                image_url: val.image_url,
                                name: val.name,
                                snippet_text: val.snippet_text,
                                phone: val.phone,
                                rating_img_url: val.rating_img_url,
                                going: 0

                            });

                        });

                        location.save(function (err) {

                            if (err) {

                                return err;

                            } else {

                                if (req.isAuthenticated()) {

                                    res.render("location", {
                                        data: data.businesses,
                                        searchByApi: true,
                                        userId: req.user._id,
                                        isAuth: true
                                    });

                                } else {

                                    res.render("location", {
                                        data: data.businesses,
                                        searchByApi: true,
                                        isAuth: false

                                    });

                                }

                            }

                        });

                    }).catch(function (err) {

                        res.json({
                            id: JSON.parse(err.data).error.id
                        });
                    });

                }

            }

        });

    });

    app.get("/going", function (req, res) {

        var barId = req.query.barId,
            userId = req.query.userId,
            location = req.query.location;

        Location.findOne({
            location: location
        }, function (err, data) {

            if (err) {
                return err;
            } else {

                data.bars.id(barId).going = data.bars.id(barId).going + 1;

                data.save(function (err) {

                    if (err) {

                        return err;

                    } else {

                        User.findOne({
                            _id: userId
                        }, function (err, doc) {

                            if (err) {
                                return err;
                            } else {

                                if (doc.usersGoing.indexOf(barId) !== 1) {

                                    doc.usersGoing.push(barId);

                                } else {

                                    doc.usersGoing.push(barId);

                                }

                                doc.save(function (err) {

                                    if (err) {

                                        return err;

                                    } else {

                                        res.json({
                                            going: data.bars.id(barId).going
                                        });

                                    }

                                });

                            }

                        });


                    }

                });

            }

        });

    });

    app.get("/notgoing", function (req, res) {

        var barId = req.query.barId,
            userId = req.query.userId,
            location = req.query.location;

        Location.findOne({
            location: location
        }, function (err, data) {

            if (err) {
                return err;
            } else {

                data.bars.id(barId).going = data.bars.id(barId).going - 1;

                data.save(function (err) {

                    if (err) {

                        return err;

                    } else {

                        User.findOne({
                            _id: userId
                        }, function (err, doc) {

                            if (err) {
                                return err;
                            } else {

                                doc.usersGoing.splice(doc.usersGoing.indexOf(barId), 1);

                                doc.save(function (err) {

                                    if (err) {

                                        return err;

                                    } else {

                                        res.json({
                                            going: data.bars.id(barId).going
                                        });

                                    }

                                });

                            }

                        });

                    }

                });

            }

        });

    });

    app.get("/", function (req, res, next) {

        if (req.isAuthenticated()) {

            if (req.user.lastSearch !== "") {

                Location.findOne({
                    location: req.user.lastSearch
                }, function (err, data) {

                    res.render("index", {
                        isAuth: true,
                        isLastSearch: true,
                        data: data.bars,
                        luser: req.user.uname,
                        userId: req.user._id,
                        lastSearch: req.user.lastSearch,
                        usersGoing: req.user.usersGoing
                    });

                });

            } else {

                res.render("index", {
                    isAuth: true,
                    isLastSearch: false,
                    luser: req.user.uname
                });

            }

        } else {

            res.render("index", {
                isAuth: false,
                isLastSearch: false
            });

        }

    });


    app.post('/login', function (req, res, next) {

        passport.authenticate('login', function (err, user, info) {

            if (err) {

                return next(err);
            }

            if (!user) {

                var er = req.flash("message")[0];

                res.json({
                    error: er
                });

            } else {

                req.login(user, function (err) {

                    if (err) {

                        return next(err);

                    } else {

                        if (req.body.lastSearch) {

                            User.findOne({
                                _id: req.user._id
                            }, function (err, data) {

                                data.lastSearch = req.body.lastSearch;

                                data.save(function (err) {

                                    if (err) {

                                        return err;

                                    } else {

                                        res.redirect("/");

                                    }

                                });

                            });

                        } else {

                            res.redirect("/");

                        }

                    }

                });
            }

        })(req, res, next);

    });

    app.post('/signup', function (req, res, next) {

        passport.authenticate('signup', function (err, user, info) {

            if (err) {
                return next(err);
            }
            if (!user) {

                var er = req.flash("message")[0];

                res.json({
                    error: er
                });

            } else {

                req.login(user, function (err) {

                    if (err) {

                        return next(err);

                    } else {

                        res.redirect("/");

                    }

                });

            }

        })(req, res, next);

    });

}
