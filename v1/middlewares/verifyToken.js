const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtsecret = process.env.JWTSECRET;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedtoken;
    if (token == null) return res.sendStatus(401);

    decodedtoken = jwt.verify(token, jwtsecret);
    req.userId = decodedtoken?.id;
    next();
  } catch (error) {
    return res.sendStatus(403);
  }
};

// const verifyToken = async (req, res, next) => {
//   req.userId = "607eeb05d954c5446411581a";
//   next();
// };

module.exports = { verifyToken };