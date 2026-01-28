const mongoose = require("mongoose");

const productschema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    imageUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productschema);
