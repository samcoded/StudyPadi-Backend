const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String },
  institution: { type: String },
  course: { type: String },
  photoUrl: { type: String },
  timestamp: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
