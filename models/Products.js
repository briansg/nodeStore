var mongoose = require("mongoose");

var productsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
})

module.exports = mongoose.model("Products", productsSchema);