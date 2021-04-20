const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  timestamp: { type: String, required: true },
  id: { type: String },
  completed: { type: Boolean, required: true },
});

module.exports = mongoose.model("Task", taskSchema);
