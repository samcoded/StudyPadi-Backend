const UserModel = require("../../models/user.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendMail = require("../../services/sendMail");

const changePassword = async (id, oldPassword, newPassword) => {
  try {
    const user = await UserModel.findById(id);

    if (oldPassword != "none") {
      const isPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isPasswordCorrect)
        return {
          success: false,
          code: 400,
          message: "Invalid credentials",
          data: {},
        };
    }
    const hash = await bcrypt.hash(newPassword, 12);
    try {
      // return { code: 403, message: "hello", success: false, data: {} };
      await UserModel.findByIdAndUpdate(id, { password: hash }, { new: true });
      return {
        success: true,
        code: 200,
        message: "Password changed successfully",
        data: {},
      };
    } catch (error) {
      return {
        success: false,
        code: 404,
        message: error.message,
        data: {},
      };
    }
  } catch (error) {
    return {
      success: false,
      code: 500,
      message: error.message,
      data: {},
    };
  }
};

const resetToken = async (emailAddress) => {
  try {
    const user = await UserModel.findOne({ emailAddress });
    if (!user)
      return {
        success: false,
        code: 400,
        message: "User does not exist",
        data: {},
      };

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
        (error, data) => {
          if (error)
            return {
              success: false,
              code: 500,
              message: error.message,
              data: {},
            };
        }
      );
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: error.message,
        data: {},
      };
    }

    //send mail with Token
    let subject = "STUDYPADI PASSWORD RECOVERY";
    let body = `<h1>PASSWORD RESET CODE</h1>
    <h2>${resetToken}</h2>
    <h3>Input code in the app to reset password</h3>`;
    console.log(resetToken);
    try {
      await sendMail(emailAddress, subject, body);
    } catch (error) {
      return {
        success: false,
        code: 500,
        message: error.message,
        data: {},
      };
    }

    //send success
    return {
      success: true,
      code: 200,
      message: `Reset Token Sent to ${emailAddress}`,
      data: {},
    };
  } catch (error) {
    return {
      success: false,
      code: 500,
      message: error.message,
      data: {},
    };
  }
};

const checkResetToken = async (emailAddress, resetToken) => {
  let passwordResetToken = await UserModel.findOne({ emailAddress });
  if (!passwordResetToken) {
    return {
      success: false,
      code: 404,
      message: "Invalid email",
      data: {},
    };
  }
  if (!passwordResetToken.resetToken) {
    return {
      success: false,
      code: 404,
      message: "Invalid request",
      data: {},
    };
  }
  const isValid = await bcrypt.compare(
    resetToken,
    passwordResetToken.resetToken
  );

  if (!isValid) {
    return {
      success: false,
      code: 404,
      message: "Code invalid",
      data: {},
    };
  }
  return {
    success: true,
    code: 200,
    message: "Code valid",
    data: { id: passwordResetToken._id, emailAddress },
  };
};

module.exports = { changePassword, resetToken, checkResetToken };
