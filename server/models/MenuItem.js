const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  image: String,
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
