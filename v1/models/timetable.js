const mongoose = require("mongoose");

const timetableSchema = mongoose.Schema({
  day: { type: String, required: true },
  location: { type: String, required: true },
  userId: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, required: true },
  timestamp: { type: String, required: true },
  id: { type: String },
});

module.exports = mongoose.model("Timetable", timetableSchema);
