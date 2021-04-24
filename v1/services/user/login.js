const UserModel = require("../../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwtsecret = process.env.JWTSECRET;

const login = async (emailAddress, password) => {
  try {
    const oldUser = await UserModel.findOne({ emailAddress });
    if (!oldUser)
      return {
        success: false,
        code: 400,
        message: "This user doesnt exist",
        data: {},
      };
    if (password != null) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        oldUser.password
      );
      if (!isPasswordCorrect)
        return {
          success: false,
          code: 400,
          message: "Invalid credentials",
          data: {},
        };
    }
    const token = jwt.sign(
      { emailAddress: oldUser.emailAddress, id: oldUser._id },
      jwtsecret,
      { expiresIn: "30d" }
    );
    return {
      success: true,
      code: 200,
      message: "Logged in Successfully",
      data: {
        token,
        id: oldUser._id,
        emailAddress: oldUser.emailAddress,
        firstName: oldUser.firstName,
        lastName: oldUser.lastName,
      },
    };
  } catch (error) {
    return { success: false, code: 500, message: error.message, data: {} };
  }
};

module.exports = login;
