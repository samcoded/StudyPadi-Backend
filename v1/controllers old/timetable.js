const TimetableModel = require("../models/timetable.js");
const mongoose = require("mongoose");
const Joi = require("joi");

const getTimetables = async (req, res) => {
  const { userId } = req;

  try {
    const timetable = await TimetableModel.find({ userId });

    res.status(200).json(timetable);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getTimetable = async (req, res) => {
  const { id } = req.params;

  // check if requested user is also owner of Timetable
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Timetable with id: ${id}`);
  try {
    const timetable = await TimetableModel.findById(id);
    if (timetable.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      res.status(200).json(timetable);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createTimetable = async (req, res) => {
  const timetable = req.body;
  //validate
  const timetableschema = Joi.object().keys({
    day: Joi.string().required(),
    location: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    subject: Joi.string().required(),
  });

  try {
    await timetableschema.validateAsync(timetable);
  } catch (error) {
    return res.status(400).send(error);
  }
  const newtimetable = new TimetableModel({
    ...timetable,
    userId: req.userId,
    timestamp: new Date().toISOString(),
    completed: false,
  });

  try {
    await newtimetable.save();

    res.status(201).json(newtimetable);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateTimetable = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const updatedTimetable = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Timetable with id: ${id}`);

  try {
    const timetable = await TimetableModel.findById(id);
    if (timetable.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      try {
        await TimetableModel.findByIdAndUpdate(
          id,
          updatedTimetable,
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

  // res.json(updatedTimetable);
};

const deleteTimetable = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Timetable with id: ${id}`);
  try {
    const timetable = await TimetableModel.findById(id);
    if (timetable.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      try {
        await TimetableModel.findByIdAndRemove(id);
        res.status(200).json({ message: "Timetable deleted successfully." });
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getTimetables,
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
};
