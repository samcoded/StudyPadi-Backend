const StudygoalModel = require("../models/schedule.js");
const mongoose = require("mongoose");
const Joi = require("joi");

const getStudygoals = async (req, res) => {
  const { userId } = req;

  try {
    const studygoal = await StudygoalModel.find({ userId });
    return res.status(200).json({
      success: true,
      message: "User studygoals retrieved",
      data: { studygoal },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const getStudygoal = async (req, res) => {
  const { id } = req.params;

  // check if requested user is also owner of Studygoal
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });
  try {
    const studygoal = await StudygoalModel.findById(id);
    if (studygoal.userId != userId) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      return res.status(200).json({
        success: 200,
        message: "Studygoal details retrieved",
        data: { studygoal },
      });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const createStudygoal = async (req, res) => {
  const studygoal = req.body;
  //validate
  const studygoalschema = Joi.object().keys({
    goal: Joi.string().required(),
    date: Joi.string().required(),
  });

  try {
    await studygoalschema.validateAsync(studygoal);
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, data: {} });
  }

  const newstudygoal = new StudygoalModel({
    ...studygoal,
    userId: req.userId,
    timestamp: new Date().toISOString(),
    completed: false,
  });

  try {
    await newstudygoal.save();

    return res.status(200).json({
      success: true,
      message: "Studygoal created",
      data: { newstudygoal },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const updateStudygoal = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const updatedStudygoal = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });

  try {
    const studygoal = await StudygoalModel.findById(id);
    if (studygoal.userId != userId) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      try {
        await StudygoalModel.findByIdAndUpdate(
          id,
          updatedStudygoal,
          { new: true },
          (err, data) => {
            return res.status(200).json({
              success: true,
              message: "Studygoal Updated",
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

const checkStudygoal = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });
  try {
    const studygoal = await StudygoalModel.findById(id);
    if (studygoal.userId != userId) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      try {
        let check = !studygoal.completed;

        await StudygoalModel.findByIdAndUpdate(
          id,
          {
            completed: check,
          },
          { new: true },
          (err, data) => {
            return res.status(200).json({
              success: true,
              message: "Studygoal checked",
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

const deleteStudygoal = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });
  try {
    const studygoal = await StudygoalModel.findById(id);
    if (studygoal.userId != userId) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      try {
        await StudygoalModel.findByIdAndRemove(id);
        return res.status(200).json({
          success: true,
          message: "Studygoal deleted successfully",
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
  getStudygoals,
  getStudygoal,
  createStudygoal,
  updateStudygoal,
  checkStudygoal,
  deleteStudygoal,
};
