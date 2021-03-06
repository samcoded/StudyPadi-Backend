const mongoose = require("mongoose");

const studygoalSchema = mongoose.Schema({
  goal: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: String, required: true },
  timestamp: { type: String, required: true },
  id: { type: String },
  completed: { type: Boolean, required: true },
});

module.exports = mongoose.model("Studygoal", studygoalSchema);
