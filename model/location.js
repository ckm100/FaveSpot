var mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    LocationSchema;

LocationSchema = new Schema({

    location: String,
    bars: [{
        id: String,
        image_url: String,
        name: String,
        snippet_text: String,
        phone: Number,
        rating_img_url: String,
        going: Number
    }]
});


module.exports = mongoose.model("Location", LocationSchema);
