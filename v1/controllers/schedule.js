const ScheduleModel = require("../models/schedule.js");
const mongoose = require("mongoose");
const Joi = require("joi");

const getSchedules = async (req, res) => {
  const id = req.userId || req.params.id;

  try {
    const schedule = await ScheduleModel.find({ userId: id });

    return res.status(200).json({
      success: true,
      message: "User schedules retrieved",
      data: { schedule },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const getSchedule = async (req, res) => {
  const { id } = req.params;

  // check if requested user is also owner of schedule
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });
  try {
    const schedule = await ScheduleModel.findById(id);
    if (schedule.userId != userId || !req.adminRole) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      return res.status(200).json({
        success: true,
        message: "Schedule details retrieved",
        data: { schedule },
      });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
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
    return res
      .status(400)
      .json({ success: false, message: error.message, data: {} });
  }
  const newschedule = new ScheduleModel({
    ...schedule,
    userId: req.userId,
    timestamp: new Date().toISOString(),
  });

  try {
    await newschedule.save();
    return res.status(200).json({
      success: true,
      message: "Schedule created",
      data: { newschedule },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const updatedSchedule = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });

  try {
    const schedule = await ScheduleModel.findById(id);
    if (schedule.userId != userId || !req.adminRole) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      try {
        await ScheduleModel.findByIdAndUpdate(
          id,
          updatedSchedule,
          { new: true },
          (err, data) => {
            return res.status(200).json({
              success: true,
              message: "Schedule Updated",
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

const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });
  try {
    const schedule = await ScheduleModel.findById(id);
    if (schedule.userId != userId || !req.adminRole) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      try {
        await ScheduleModel.findByIdAndRemove(id);
        return res.status(200).json({
          success: true,
          message: "Schedule deleted successfully",
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
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
