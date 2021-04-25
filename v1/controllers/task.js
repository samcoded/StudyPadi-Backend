const TaskModel = require("../models/task.js");
const mongoose = require("mongoose");
const Joi = require("joi");

const getTasks = async (req, res) => {
  const id = req.userId || req.params.id;

  try {
    const task = await TaskModel.find({ userId: id });

    return res.status(200).json({
      success: true,
      message: "User tasks retrieved",
      data: { task },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;

  // check if requested user is also owner of task
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });
  try {
    const task = await TaskModel.findById(id);
    if (task.userId != userId || !req.adminRole) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      return res.status(200).json({
        success: true,
        message: "Task details retrieved",
        data: { task },
      });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
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
    return res
      .status(400)
      .json({ success: false, message: error.message, data: {} });
  }
  const newtask = new TaskModel({
    ...task,
    userId: req.userId,
    timestamp: new Date().toISOString(),
    completed: false,
  });

  try {
    await newtask.save();
    return res.status(200).json({
      success: true,
      message: "Task created",
      data: { newtask },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const updatedTask = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });

  try {
    const task = await TaskModel.findById(id);
    if (task.userId != userId || !req.adminRole) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      try {
        await TaskModel.findByIdAndUpdate(
          id,
          updatedTask,
          { new: true },
          (err, data) => {
            return res.status(200).json({
              success: true,
              message: "Task Updated",
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

const checkTask = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });
  try {
    const task = await TaskModel.findById(id);
    if (task.userId != userId || !req.adminRole) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
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
            return res.status(200).json({
              success: true,
              message: "Task checked",
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

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });
  try {
    const task = await TaskModel.findById(id);
    if (task.userId != userId || !req.adminRole) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Request", data: {} });
    } else {
      try {
        await TaskModel.findByIdAndRemove(id);
        return res.status(200).json({
          success: true,
          message: "Task deleted successfully",
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
  getTasks,
  getTask,
  createTask,
  updateTask,
  checkTask,
  deleteTask,
};
