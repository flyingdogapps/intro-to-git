var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId, //the ID
            ref: "User" //the model we are looking for with the ID
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);