const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtsecret = process.env.JWTSECRET;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedtoken;
    if (token == null)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized request", data: {} });

    decodedtoken = jwt.verify(token, jwtsecret);
    req.userId = decodedtoken?.id;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized request", data: {} });
  }
};

// const verifyToken = async (req, res, next) => {
//   // req.userId = "607eeb05d954c5446411581a";
//   req.userId = "60820534fa453b4a286181fd";
//   next();
// };

module.exports = { verifyToken };
