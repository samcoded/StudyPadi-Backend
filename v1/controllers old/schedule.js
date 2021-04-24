const ScheduleModel = require("../models/studygoal.js");
const mongoose = require("mongoose");
const Joi = require("joi");

const getSchedules = async (req, res) => {
  const { userId } = req;

  try {
    const schedule = await ScheduleModel.find({ userId });

    res.status(200).json(schedule);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getSchedule = async (req, res) => {
  const { id } = req.params;

  // check if requested user is also owner of Schedule
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Schedule with id: ${id}`);
  try {
    const schedule = await ScheduleModel.findById(id);
    if (schedule.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      res.status(200).json(schedule);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createSchedule = async (req, res) => {
  const schedule = req.body;
  //validate
  const scheduleschema = Joi.object().keys({
    name: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
  });

  try {
    await scheduleschema.validateAsync(schedule);
  } catch (error) {
    return res.status(400).send(error);
  }
  const newschedule = new ScheduleModel({
    ...schedule,
    userId: req.userId,
    timestamp: new Date().toISOString(),
    completed: false,
  });

  try {
    await newschedule.save();

    res.status(201).json(newschedule);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const updatedSchedule = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Schedule with id: ${id}`);

  try {
    const schedule = await ScheduleModel.findById(id);
    if (schedule.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      try {
        await ScheduleModel.findByIdAndUpdate(
          id,
          updatedSchedule,
          { new: true },
          (err, data) => {
            res.status(200).json(data);
          }
        );
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Schedule with id: ${id}`);
  try {
    const schedule = await ScheduleModel.findById(id);
    if (schedule.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      try {
        await ScheduleModel.findByIdAndRemove(id);
        res.status(200).json({ message: "Schedule deleted successfully." });
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
