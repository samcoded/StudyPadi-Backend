const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  googlePassport,
  facebookPassport,
  googleProcessData,
  facebookProcessData,
} = require("../controllers/auth");
const {
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
} = require("../middlewares/auth.js");
require("dotenv").config();

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

router.get("/google", googleAuth);

router.get("/google/callback", googleAuthCallback, googleProcessData);

router.get("/facebook", facebookAuth);

router.get("/facebook/callback", facebookAuthCallback, facebookProcessData);

router.get("/error", (req, res) => {
  return res
    .status(500)
    .json({ success: false, message: "An error occurred", data: {} });
});

module.exports = router;
