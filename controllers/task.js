const TaskModel = require("../models/task.js");
const mongoose = require("mongoose");
const Joi = require("joi");

const getTasks = async (req, res) => {
  const { userId } = req;

  try {
    const task = await TaskModel.find({ userId });

    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;

  // check if requested user is also owner of task
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Task with id: ${id}`);
  try {
    const task = await TaskModel.findById(id);
    if (task.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      res.status(200).json(task);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  const task = req.body;
  //validate
  const taskschema = Joi.object().keys({
    taskname: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.string().required(),
    starttime: Joi.string().required(),
    endtime: Joi.string().required(),
  });

  try {
    await taskschema.validateAsync(task);
  } catch (error) {
    return res.status(400).send(error);
  }
  const newtask = new TaskModel({
    ...task,
    userId: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newtask.save();

    res.status(201).json(newtask);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const { taskname, description, date, starttime, endtime } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No task with id: ${id}`);

  const updatedTask = {
    taskname,
    description,
    date,
    starttime,
    endtime,
    userId,
    _id: id,
  };

  //validate
  const taskschema = Joi.object().keys({
    taskname: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.string().required(),
    starttime: Joi.string().required(),
    endtime: Joi.string().required(),
  });

  try {
    await taskschema.validateAsync({
      taskname,
      description,
      date,
      starttime,
      endtime,
    });
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const task = await TaskModel.findById(id);
    if (task.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      try {
        await TaskModel.findByIdAndUpdate(id, updatedTask, { new: true });
        res.status(200).json(updatedTask);
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }

  // res.json(updatedtask);
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No task with id: ${id}`);
  try {
    const task = await TaskModel.findById(id);
    if (task.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      try {
        await TaskModel.findByIdAndRemove(id);
        res.status(200).json({ message: "task deleted successfully." });
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
