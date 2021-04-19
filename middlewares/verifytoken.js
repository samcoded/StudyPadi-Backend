const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtsecret = process.env.JWTSECRET;

const verifytoken = async (req, res, next) => {
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

module.exports = { verifytoken };
