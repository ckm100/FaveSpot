var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    UserSchema;

UserSchema = new Schema({
    uname: String,
    uemail: String,
    upassword: String,
    twitterId: String,
    lastSearch: String,
    usersGoing: []

});


module.exports = mongoose.model("User", UserSchema);
