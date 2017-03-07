var mongoose = require("mongoose");

var commentsSchema = new mongoose.Schema({
    body: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }
});

module.exports = mongoose.model("Comments", commentsSchema);