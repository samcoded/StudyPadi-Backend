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
    name: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
  });

  try {
    await taskschema.validateAsync(task);
  } catch (error) {
    return res.status(400).send(error);
  }
  const newtask = new TaskModel({
    ...task,
    userId: req.userId,
    timestamp: new Date().toISOString(),
    completed: false,
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
  const updatedTask = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No task with id: ${id}`);

  try {
    const task = await TaskModel.findById(id);
    if (task.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      try {
        await TaskModel.findByIdAndUpdate(
          id,
          updatedTask,
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

  // res.json(updatedtask);
};

const checkTask = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const updatedTask = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No task with id: ${id}`);

  try {
    const task = await TaskModel.findById(id);
    if (task.userId != userId) {
      res.status(404).json({ message: "Invalid request" });
    } else {
      try {
        let check = !task.completed;

        await TaskModel.findByIdAndUpdate(
          id,
          {
            completed: check,
          },
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
  checkTask,
};
