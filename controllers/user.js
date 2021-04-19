const UserModel = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const mongoose = require("mongoose");
require("dotenv").config();

const jwtsecret = process.env.JWTSECRET;

const login = async (req, res) => {
  const { email, password } = req.body;

  //validate
  const loginschema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  try {
    await loginschema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const oldUser = await UserModel.findOne({ email });
    if (!oldUser) return res.status(400).send("This user doesnt exist");
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { email: oldUser.email, id: oldUser._id },
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
    firstname,
    lastname,
    email,
    password,
    institution,
    course,
  } = req.body;

  const regschema = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
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
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) return res.status(400).send("This user already exists");
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await UserModel.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      institution,
      course,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, jwtsecret, {
      expiresIn: "1h",
    });
    res.status(201).json({ token, id: result._id });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

const getuser = async (req, res) => {
  const id = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);

  try {
    const user = await UserModel.findById(id);
    const { email, firstname, lastname, institution, course, _id } = user;
    const userdetails = {
      email,
      firstname,
      lastname,
      institution,
      course,
      _id,
    };
    res.status(200).json(userdetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateuser = async (req, res) => {
  const id = req.userId;
  const { email, firstname, lastname, institution, course } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No user with id: ${id}`);

  const updateduser = {
    email,
    firstname,
    lastname,
    institution,
    course,
    _id: id,
  };

  await UserModel.findByIdAndUpdate(id, updateduser, { new: true });

  res.json(updateduser);
};

module.exports = { login, register, getuser, updateuser };
