// import all the things we need
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
require("dotenv").config();
const crypto = require("crypto");
const UserModel = require("../models/user");
const login = require("../services/user/login");
const register = require("../services/user/register");

const googlePassport = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        profileFields: ["id", "displayName", "photos", "email"],
      },
      function (accessToken, refreshToken, user, cb) {
        return cb(null, user);
      }
    )
  );
};

const facebookPassport = (passport) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ["id", "displayName", "photos", "email"],
      },
      function (accessToken, refreshToken, user, cb) {
        return cb(null, user);
      }
    )
  );
};

const googleProcessData = async (req, res) => {
  const data = req.user._json;
  const firstName = data.given_name;
  const lastName = data.family_name;
  const emailAddress = data.email;

  try {
    const oldUser = await UserModel.findOne({ emailAddress });
    if (oldUser) {
      let result = await login(oldUser.emailAddress, null);
      res.status(result.code).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    }

    const password = crypto.randomBytes(5).toString("hex");
    let result = await register(firstName, lastName, emailAddress, password);
    res.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

const facebookProcessData = async (req, res) => {
  const data = req.user._json;
  const name = data.name;
  const firstName = name.split(" ")[0];
  const lastName = name.split(" ")[1];
  const emailAddress = data.email;

  try {
    const oldUser = await UserModel.findOne({ emailAddress });
    if (oldUser) {
      let result = await login(oldUser.emailAddress, null);
      res.status(result.code).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    }

    const password = crypto.randomBytes(5).toString("hex");
    let result = await register(firstName, lastName, emailAddress, password);
    res.status(result.code).json({
      success: result.success,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: {} });
  }
};

module.exports = {
  googlePassport,
  facebookPassport,
  googleProcessData,
  facebookProcessData,
};
