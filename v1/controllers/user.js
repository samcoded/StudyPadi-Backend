const UserModel = require("../models/user.js");
const mongoose = require("mongoose");
const upload = require("../services/profileUpload.js");
const login = require("../services/user/login");
const register = require("../services/user/register");
const Joi = require("joi");

const {
  changePassword,
  resetToken,
  checkResetToken,
} = require("../services/user/password");

const loginUser = async (req, res) => {
  const { emailAddress, password } = req.body;
  const loginschema = Joi.object().keys({
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    await loginschema.validateAsync(req.body);
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }

  let result = await login(emailAddress, password);
  return res.status(result.code).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
};

const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    emailAddress,
    password,
    institution,
    course,
  } = req.body;
  const regschema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
    institution: Joi.string(),
    course: Joi.string(),
  });

  try {
    await regschema.validateAsync(req.body);
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
  let result = await register(
    firstName,
    lastName,
    emailAddress,
    password,
    institution,
    course
  );
  return res.status(result.code).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
};

const changeUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const id = req.userId;
  let result = await changePassword(id, oldPassword, newPassword);
  return res.status(result.code).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
};

const passwordReset = async (req, res) => {
  const { emailAddress } = req.body;
  let result = await resetToken(emailAddress);
  return res.status(result.code).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
};

const checkResetCode = async (req, res) => {
  const { emailAddress, resetCode } = req.body;
  let result = await checkResetToken(emailAddress, resetCode);
  return res.status(result.code).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
};
const passwordResetConfirm = async (req, res) => {
  const { emailAddress, resetCode, password } = req.body;
  let checkCode = await checkResetToken(emailAddress, resetCode);
  if (checkCode.success) {
    let result = await changePassword(checkCode.data.id, "none", password);
    await UserModel.findByIdAndUpdate(
      checkCode.data.id,
      { $unset: { resetToken: 1 } },
      { new: true }
    );
    return res.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  }
  return res.status(checkCode.code).json({
    success: checkCode.success,
    message: checkCode.message,
    data: checkCode.data,
  });
};

const getUser = async (req, res) => {
  const id = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });

  try {
    const user = await UserModel.findById(id);
    const {
      emailAddress,
      firstName,
      lastName,
      institution,
      course,
      photoUrl,
      timestamp,
      _id,
    } = user;
    const userdetails = {
      emailAddress,
      firstName,
      lastName,
      institution,
      course,
      photoUrl,
      timestamp,
      _id,
    };
    return res.status(200).json({
      success: true,
      message: "User details retrieved",
      data: { userdetails },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const updateUser = async (req, res) => {
  const id = req.userId;
  const updatedUser = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });

  try {
    await UserModel.findByIdAndUpdate(
      id,
      updatedUser,
      { new: true },
      (err, data) => {
        const {
          emailAddress,
          firstName,
          lastName,
          institution,
          course,
          photoUrl,
          timestamp,
          _id,
        } = data;
        const userdetails = {
          emailAddress,
          firstName,
          lastName,
          institution,
          course,
          photoUrl,
          timestamp,
          _id,
        };
        return res.status(200).json({
          success: true,
          message: "User details updated",
          data: { userdetails },
        });
      }
    );
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const uploadProfilePic = async (req, res) => {
  const id = req.userId;

  const singleUpload = upload.single("image");

  singleUpload(req, res, async (error) => {
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.message, data: {} });
    }

    try {
      let update = { photoUrl: req.file.location };
      await UserModel.findByIdAndUpdate(id, update, { new: true });
      return res.status(200).json({
        success: true,
        message: "Profile Picture Updatted",
        data: { update },
      });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: error.message, data: {} });
    }
  });
};

const addBadge = async (req, res) => {
  const id = req.userId;
  const { badge } = req.body;
  if (!badge)
    return res
      .status(404)
      .json({ success: false, message: "Invalid request", data: {} });

  try {
    const user = await UserModel.findById(id);
    let badgeArray = [];
    const oldBadges = user.badges;
    oldBadges.forEach((badge) => {
      badgeArray.push(badge.task);
    });

    if (badgeArray.includes(badge))
      return res
        .status(404)
        .json({ success: false, message: "Badge already exist", data: {} });

    const newBadge = { task: badge };
    try {
      await UserModel.findByIdAndUpdate(
        id,
        { $push: { badges: newBadge } },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: `${badge} Badge added`, data: {} });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: err.message, data: {} });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

const getBadges = async (req, res) => {
  const id = req.userId;

  try {
    const user = await UserModel.findById(id);

    return res.status(200).json({
      success: true,
      message: "User badges retrieved",
      data: user.badges,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUser,
  updateUser,
  changeUserPassword,
  passwordReset,
  checkResetCode,
  passwordResetConfirm,
  uploadProfilePic,
  addBadge,
  getBadges,
};
