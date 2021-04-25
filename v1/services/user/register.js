const UserModel = require("../../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwtsecret = process.env.JWTSECRET;

const register = async (
  firstName,
  lastName,
  emailAddress,
  password,
  institution,
  course
) => {
  try {
    const oldUser = await UserModel.findOne({ emailAddress });
    if (oldUser)
      return {
        success: false,
        code: 400,
        message: "User already exists",
        data: {},
      };

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
        expiresIn: "30d",
      }
    );
    return {
      success: true,
      code: 201,
      message: "Registered Successfully",
      data: {
        token,
        id: result._id,
        emailAddress: result.emailAddress,
        firstName: result.firstName,
        lastName: result.lastName,
      },
    };
  } catch (error) {
    return { success: false, code: 500, message: error.message, data: {} };
  }
};

module.exports = register;
