const jwt = require("jsonwebtoken");
const AdminModel = require("../models/admin");
require("dotenv").config();
const jwtsecret = process.env.JWTSECRET;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedtoken;
    if (token == null) {
      return res
        .status(401)
        .json({ success: false, message: error.message, data: {} });
    }
    decodedtoken = jwt.verify(token, jwtsecret);

    if (decodedtoken?.admin) {
      let admin = await AdminModel.findById({ _id: decodedtoken?.id });
      if (!admin.active) {
        return res.status(403).json({
          success: false,
          message: "Admin not activated",
          data: {},
        });
      } else {
        req.adminRole = admin.role;
        req.adminId = admin._id;
      }
    } else {
      req.userId = decodedtoken?.id;
    }
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: error.message, data: {} });
  }
};

const verifyAdmin = (req, res, next) => {
  if (!req.adminId || !req.adminRole) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      data: {},
    });
  }
  next();
};

const verifySuperAdmin = (req, res, next) => {
  if (!req.adminId || req.adminRole != 2) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
      data: {},
    });
  }
  next();
};

// const verifyToken = async (req, res, next) => {
//   // req.userId = "607eeb05d954c5446411581a";
//   req.userId = "60820534fa453b4a286181fd";
//   next();
// };

module.exports = { verifyToken, verifyAdmin, verifySuperAdmin };
