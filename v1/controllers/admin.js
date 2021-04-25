const AdminModel = require("../models/admin.js");
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwtsecret = process.env.JWTSECRET;

const loginAdmin = async (req, res) => {
  const { emailAddress, password } = req.body;
  const loginschema = Joi.object().keys({
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    await loginschema.validateAsync(req.body);
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, data: {} });
  }

  try {
    const oldAdmin = await AdminModel.findOne({ emailAddress });
    if (!oldAdmin)
      return res.status(400).json({
        success: false,
        message: "This admin doesnt exist",
        data: {},
      });
    if (password != null) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        oldAdmin.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
          data: {},
        });
    }
    const token = jwt.sign(
      {
        emailAddress: oldAdmin.emailAddress,
        id: oldAdmin._id,
        admin: { status: true, role: oldAdmin.role },
      },
      jwtsecret,
      { expiresIn: "30d" }
    );
    return res.status(200).json({
      success: true,
      message: "Logged in Successfully",
      data: {
        token,
        id: oldAdmin._id,
        emailAddress: oldAdmin.emailAddress,
        firstName: oldAdmin.firstName,
        lastName: oldAdmin.lastName,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

const registerAdmin = async (req, res) => {
  const { firstName, lastName, emailAddress, password } = req.body;
  const regschema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    await regschema.validateAsync(req.body);
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: error.message, data: {} });
  }
  try {
    const oldAdmin = await AdminModel.findOne({ emailAddress });
    if (oldAdmin)
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
        data: {},
      });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await AdminModel.create({
      emailAddress,
      password: hashedPassword,
      firstName,
      lastName,
      timestamp: new Date().toISOString(),
    });
    const token = jwt.sign(
      {
        emailAddress: result.emailAddress,
        id: result._id,
        admin: { status: true, role: result.role },
      },
      jwtsecret,
      {
        expiresIn: "30d",
      }
    );
    return res.status(200).json({
      success: true,
      message: "Registered Successfully",
      data: {
        token,
        id: result._id,
        emailAddress: result.emailAddress,
        firstName: result.firstName,
        lastName: result.lastName,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

const changeAdminPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const id = req.params.id || req.adminId;
  try {
    const admin = await AdminModel.findById(id);

    if (oldPassword != "none") {
      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        admin.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
          data: {},
        });
    }
    const hash = await bcrypt.hash(newPassword, 12);
    try {
      await AdminModel.findByIdAndUpdate(id, { password: hash }, { new: true });
      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
        data: {},
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        data: {},
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
      data: {},
    });
  }
};

const getAllAdmins = async (req, res) => {
  if (!req.adminRole || req.adminRole < 2) {
    return res
      .status(404)
      .json({ success: false, message: "Unauthorised Request", data: {} });
  }
  try {
    const admin = await AdminModel.find();
    const {
      emailAddress,
      firstName,
      lastName,
      institution,
      course,
      photoUrl,
      timestamp,
      _id,
    } = admin;
    const admindetails = {
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
      message: "All admins details retrieved",
      data: { admindetails },
    });
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const deleteAdmin = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ success: false, message: "Invalid ID", data: {} });
  try {
    if (!req.adminRole || req.adminRole < 2) {
      return res
        .status(404)
        .json({ success: false, message: "Unauthorised Request", data: {} });
    }
    try {
      await AdminModel.findByIdAndRemove(id);
      return res.status(200).json({
        success: true,
        message: "Admin deleted successfully",
        data: {},
      });
    } catch (error) {
      return res
        .status(404)
        .json({ success: false, message: error.message, data: {} });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ success: false, message: error.message, data: {} });
  }
};

const getAdmin = async (req, res) => {
  const id = req.params.id || req.adminId;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID", data: {} });

  try {
    const admin = await AdminModel.findById(id);
    const { emailAddress, firstName, lastName, timestamp, _id } = admin;
    const admindetails = {
      emailAddress,
      firstName,
      lastName,
      timestamp,
      _id,
    };
    return res.status(200).json({
      success: true,
      message: "Admin details retrieved",
      data: { admindetails },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

const updateAdmin = async (req, res) => {
  const id = req.params.id || req.adminId;
  const updatedAdmin = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID", data: {} });

  try {
    await AdminModel.findByIdAndUpdate(
      id,
      updatedAdmin,
      { new: true },
      (err, data) => {
        const { emailAddress, firstName, lastName, timestamp, _id } = data;
        const admindetails = {
          emailAddress,
          firstName,
          lastName,
          timestamp,
          _id,
        };
        return res.status(200).json({
          success: true,
          message: "Admin details updated",
          data: { admindetails },
        });
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

module.exports = {
  loginAdmin,
  registerAdmin,
  getAdmin,
  updateAdmin,
  changeAdminPassword,
  getAllAdmins,
  deleteAdmin,
};
