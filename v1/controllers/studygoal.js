const StudygoalModel = require("../models/schedule.js");
const mongoose = require("mongoose");
const Joi = require("joi");

const getStudygoals = async (req, res) => {
  const { userId } = req;

  try {
    const studygoal = await StudygoalModel.find({ userId });

    res.status(200).json(studygoal);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getStudygoal = async (req, res) => {
  const { id } = req.params;

  // check if requested user is also owner of Studygoal
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Studygoal with id: ${id}`);
  try {
    const studygoal = await StudygoalModel.findById(id);
    if (studygoal.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      res.status(200).json(studygoal);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
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
    return res.status(400).send(error);
  }
  const newstudygoal = new StudygoalModel({
    ...studygoal,
    userId: req.userId,
    timestamp: new Date().toISOString(),
    completed: false,
  });

  try {
    await newstudygoal.save();

    res.status(201).json(newstudygoal);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateStudygoal = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const updatedStudygoal = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Studygoal with id: ${id}`);

  try {
    const studygoal = await StudygoalModel.findById(id);
    if (studygoal.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      try {
        await StudygoalModel.findByIdAndUpdate(
          id,
          updatedStudygoal,
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

const deleteStudygoal = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Studygoal with id: ${id}`);
  try {
    const studygoal = await StudygoalModel.findById(id);
    if (studygoal.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      try {
        await StudygoalModel.findByIdAndRemove(id);
        res.status(200).json({ message: "Studygoal deleted successfully." });
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getStudygoals,
  getStudygoal,
  createStudygoal,
  updateStudygoal,
  deleteStudygoal,
};
