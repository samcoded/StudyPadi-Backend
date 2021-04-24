const UserModel = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();
const upload = require("../middlewares/profileUpload.js");
const sendMail = require("../middlewares/sendMail");

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

const changePassword = async (req, res) => {
  const { oldpassword, newpassword } = req.body;
  const id = req.userId;
  console.log(id);
  try {
    const user = await UserModel.findById(id);
    const isPasswordCorrect = await bcrypt.compare(oldpassword, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const hash = await bcrypt.hash(newpassword, 12);
    try {
      await UserModel.findByIdAndUpdate(
        id,
        { password: hash },
        { new: true },
        async () => {
          //send mail that password has been reset

          //delete token here
          await UserModel.findByIdAndUpdate(
            id,
            { resetToken: "" },
            { new: true }
          );

          //send success message
          res.status(200).json({ message: "Password changed" });
        }
      );
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const setResetToken = async (req, res) => {
  const { emailAddress } = req.body;

  try {
    const user = await UserModel.findOne({ emailAddress });
    if (!user) return res.status(400).send("This user doesnt exist");

    if (user.resetToken) {
      //delete token
      await UserModel.findByIdAndUpdate(
        user._id,
        { $unset: { resetToken: 1 } },
        { new: true }
      );
    }

    let resetToken = crypto.randomBytes(4).toString("hex");
    const hash = await bcrypt.hash(resetToken, 12);

    try {
      await UserModel.findByIdAndUpdate(
        user._id,
        { $set: { resetToken: hash } },
        { new: true },
        (err, data) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Something went wrong", error: err });
        }
      );
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    }

    //send mail with Token
    let subject = "STUDYPADI PASSWORD RECOVERY";
    let body = `<h1>PASSWORD RESET CODE</h1>
    <h2>${resetToken}</h2>
    <h3>Input code in the app to reset password</h3>`;

    try {
      await sendMail(emailAddress, subject, body);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    }

    //send success
    return res.status(200).json({
      message: `Reset Token Sent Email Address ${emailAddress}`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const checkResetToken = async (req, res) => {
  const { emailAddress, resetToken } = req.body;
  let passwordResetToken = await UserModel.findOne({ emailAddress });
  if (!passwordResetToken) {
    res.status(404).json({ message: "Invalid request" });
    //NO TOKEN AND SEND ERROR
  }

  const isValid = await bcrypt.compare(
    resetToken,
    passwordResetToken.resetToken
  );

  if (!isValid) {
    res.status(404).json({ message: "Token invalid" });
    //token not valid, send error
  }
  res.status(200).json({ message: "Token valid" });
};

const resetPassword = async (req, res) => {
  const { emailAddress, resetToken, password } = req.body;
  let passwordResetToken = await UserModel.findOne({ emailAddress });
  if (!passwordResetToken) {
    res.status(404).json({ message: "Invalid request" });
    //NO TOKEN AND SEND ERROR
  }
  const id = passwordResetToken._id;
  const oldToken = passwordResetToken.resetToken;
  if (!oldToken) return res.status(404).json({ message: "Invalid request" });
  const isValid = await bcrypt.compare(
    resetToken,
    passwordResetToken.resetToken
  );

  if (!isValid) {
    res.status(404).json({ message: "Token invalid" });
    //token not valid, send error
  }

  const hash = await bcrypt.hash(password, 12);

  try {
    await UserModel.findByIdAndUpdate(
      id,
      { password: hash },
      { new: true },
      async (err, data) => {
        //send mail that password has been reset

        //delete token here
        await UserModel.findByIdAndUpdate(
          id,
          { $unset: { resetToken: 1 } },
          { new: true }
        );

        //send success message
        res.status(200).json({ message: "Password resetted" });
      }
    );
  } catch (error) {
    res.status(404).json({ message: error.message });
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

const addBadge = async (req, res) => {
  const id = req.userId;
  const { badge } = req.body;
  if (!badge) return res.status(404).json({ message: "Invalid request" });

  try {
    const user = await UserModel.findById(id);
    let badgeArray = [];
    const oldBadges = user.badges;
    oldBadges.forEach((badge) => {
      badgeArray.push(badge.task);
    });

    if (badgeArray.includes(badge))
      return res.status(404).json({ message: "Badge already exist" });

    const newBadge = { task: badge };
    try {
      await UserModel.findByIdAndUpdate(
        id,
        { $push: { badges: newBadge } },
        { new: true }
      );
      res.status(200).json({ message: `${badge} Badge added` });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

const getBadges = async (req, res) => {
  const id = req.userId;

  try {
    const user = await UserModel.findById(id);

    res.status(200).json(user.badges);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = {
  login,
  register,
  getUser,
  updateUser,
  uploadProfilePic,
  changePassword,
  setResetToken,
  checkResetToken,
  resetPassword,
  addBadge,
  getBadges,
};
