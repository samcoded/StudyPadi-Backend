const mongoose = require("mongoose");

const scheduleSchema = mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  timestamp: { type: String, required: true },
  id: { type: String },
});

module.exports = mongoose.model("Schedule", scheduleSchema);
