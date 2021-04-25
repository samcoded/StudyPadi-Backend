const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String },
  role: { type: Number, default: 1 },
  active: { type: Boolean, default: true },
  timestamp: { type: String, required: true },
});

module.exports = mongoose.model("Admin", adminSchema);
