const UserModel = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const mongoose = require("mongoose");
require("dotenv").config();
const upload = require("../middlewares/profileUpload.js");

const jwtsecret = process.env.JWTSECRET;

const login = async (req, res) => {
  const { emailAddress, password } = req.body;

  //validate
  const loginschema = Joi.object().keys({
    emailAddress: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    await loginschema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const oldUser = await UserModel.findOne({ emailAddress });
    if (!oldUser) return res.status(400).send("This user doesnt exist");
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { emailAddress: oldUser.emailAddress, id: oldUser._id },
      jwtsecret,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, id: oldUser._id });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

const register = async (req, res) => {
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
    return res.status(400).send(error);
  }

  try {
    const oldUser = await UserModel.findOne({ emailAddress });
    if (oldUser) return res.status(400).send("This user already exists");
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await UserModel.create({
      emailAddress,
      password: hashedPassword,
      firstName,
      lastName,
      institution,
      course,
      timestamp: new Date().toISOString(),
    });
    const token = jwt.sign(
      { emailAddress: result.emailAddress, id: result._id },
      jwtsecret,
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({ token, id: result._id });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

const getUser = async (req, res) => {
  const id = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);

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
    res.status(200).json(userdetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const id = req.userId;
  const updatedUser = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No task with id: ${id}`);

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
        res.status(200).json(userdetails);
      }
    );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const uploadProfilePic = async (req, res) => {
  const id = req.userId;
  const singleUpload = upload.single("image");

  singleUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    let update = { photoUrl: req.file.location };
    try {
      await UserModel.findByIdAndUpdate(id, update, { new: true });
      res.status(200).json(update);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
};

module.exports = { login, register, getUser, updateUser, uploadProfilePic };
