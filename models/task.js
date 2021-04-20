const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  taskname: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String, required: true },
  date: { type: String, required: true },
  starttime: { type: String, required: true },
  endtime: { type: String, required: true },
  createdAt: { type: String, required: true },
  id: { type: String },
});

module.exports = mongoose.model("Task", taskSchema);
