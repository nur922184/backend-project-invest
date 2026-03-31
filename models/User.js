const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true },
  password: String,
  refCode: String,
  referredBy: String,
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);