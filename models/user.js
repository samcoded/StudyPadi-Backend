const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String },
  institution: { type: String },
  course: { type: String },
  avatar: { type: String },
});

module.exports = mongoose.model("User", userSchema);
