const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // 24h TTL
});

module.exports = mongoose.model("Session", sessionSchema);
