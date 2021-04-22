const express = require("express");
const router = express.Router();
const passport = require("passport");
const { googlePassport, facebookPassport } = require("../middlewares/auth");
const { processData, processError } = require("../controllers/auth.js");
require("dotenv").config();
const crypto = require("crypto");
const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtsecret = process.env.JWTSECRET;

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

googlePassport(passport);
facebookPassport(passport);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/error",
  }),
  async (req, res) => {
    const data = req.user._json;
    const firstName = data.given_name;
    const lastName = data.family_name;
    const emailAddress = data.email;

    try {
      const oldUser = await UserModel.findOne({ emailAddress });
      if (oldUser) {
        const token = jwt.sign(
          { emailAddress: oldUser.emailAddress, id: oldUser._id },
          jwtsecret,
          {
            expiresIn: "1h",
          }
        );
        res.status(201).json({ token, id: oldUser._id });
      }

      const password = crypto.randomBytes(10).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 12);
      const result = await UserModel.create({
        emailAddress,
        password: hashedPassword,
        firstName,
        lastName,
        timestamp: new Date().toISOString(),
      });
      const token = jwt.sign(
        { emailAddress: result.emailAddress, id: result._id },
        jwtsecret,
        {
          expiresIn: "1h",
        }
      );
      return res.status(201).json({ token, id: result._id });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });

      console.log(error);
    }
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/api/v1/auth/error",
  }),
  async (req, res) => {
    const data = req.user._json;
    const name = data.name;
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];
    const emailAddress = data.email;

    try {
      const oldUser = await UserModel.findOne({ emailAddress });
      if (oldUser) {
        const token = jwt.sign(
          { emailAddress: oldUser.emailAddress, id: oldUser._id },
          jwtsecret,
          {
            expiresIn: "1h",
          }
        );
        res.status(201).json({ token, id: oldUser._id });
      }

      const password = crypto.randomBytes(10).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 12);
      const result = await UserModel.create({
        emailAddress,
        password: hashedPassword,
        firstName,
        lastName,
        timestamp: new Date().toISOString(),
      });
      const token = jwt.sign(
        { emailAddress: result.emailAddress, id: result._id },
        jwtsecret,
        {
          expiresIn: "1h",
        }
      );
      return res.status(201).json({ token, id: result._id });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });

      console.log(error);
    }
  }
);

router.get("/error", processError);

module.exports = router;
