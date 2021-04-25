const TimetableModel = require("../models/timetable.js");
const mongoose = require("mongoose");
const Joi = require("joi");

const getTimetables = async (req, res) => {
  const id = req.userId || req.params.id;

  try {
    const timetable = await TimetableModel.find({ userId: id });

    return res.status(200).json({
      success: true,
      message: "User timetables retrieved",
      data: { timetable },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const getTimetable = async (req, res) => {
  const { id } = req.params;

  // check if requested user is also owner of Timetable
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });
  try {
    const timetable = await TimetableModel.findById(id);
    if (timetable.userId != userId || !req.adminRole) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      return res.status(200).json({
        success: true,
        message: "Timetable details retrieved",
        data: { timetable },
      });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
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
    return res
      .status(400)
      .json({ success: false, message: error.message, data: {} });
  }
  const newtimetable = new TimetableModel({
    ...timetable,
    userId: req.userId,
    timestamp: new Date().toISOString(),
    completed: false,
  });

  try {
    await newtimetable.save();

    return res.status(200).json({
      success: true,
      message: "Timetable created",
      data: { newtimetable },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const updateTimetable = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const updatedTimetable = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });

  try {
    const timetable = await TimetableModel.findById(id);
    if (timetable.userId != userId || !req.adminRole) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      try {
        await TimetableModel.findByIdAndUpdate(
          id,
          updatedTimetable,
          { new: true },
          (err, data) => {
            return res.status(200).json({
              success: true,
              message: "Timetable Updated",
              data: { data },
            });
          }
        );
      } catch (error) {
        return res
          .status(404)
          .json({ success: false, message: error.message, data: {} });
      }
    }
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const deleteTimetable = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });
  try {
    const timetable = await TimetableModel.findById(id);
    if (timetable.userId != userId || !req.adminRole) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      try {
        await TimetableModel.findByIdAndRemove(id);
        return res.status(200).json({
          success: true,
          message: "Timetable deleted successfully",
          data: {},
        });
      } catch (error) {
        return res
          .status(404)
          .json({ success: false, message: error.message, data: {} });
      }
    }
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

module.exports = {
  getTimetables,
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
};
