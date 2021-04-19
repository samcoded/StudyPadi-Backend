const TaskModel = require("../models/task.js");
const mongoose = require("mongoose");

const gettasks = async (req, res) => {
  const { userId } = req;

  try {
    const task = await TaskModel.find({ userId });

    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const gettask = async (req, res) => {
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

const createtask = async (req, res) => {
  const task = req.body;

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

const updatetask = async (req, res) => {
  const { id } = req.params;
  const { taskname, description, date, starttime, endtime } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No task with id: ${id}`);

  const updatedtask = {
    taskname,
    description,
    date,
    starttime,
    endtime,
    userId: req.userId,
    _id: id,
  };

  await TaskModel.findByIdAndUpdate(id, updatedtask, { new: true });

  res.json(updatedtask);
};

const deletetask = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No task with id: ${id}`);

  await TaskModel.findByIdAndRemove(id);

  res.json({ message: "task deleted successfully." });
};

module.exports = {
  gettasks,
  gettask,
  createtask,
  updatetask,
  deletetask,
};
