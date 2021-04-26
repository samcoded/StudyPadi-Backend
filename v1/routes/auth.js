const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  googlePassport,
  facebookPassport,
  googleProcessData,
  facebookProcessData,
} = require("../controllers/auth");
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
  googleProcessData
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
  facebookProcessData
);

router.get("/error", (req, res) => {
  return res
    .status(500)
    .json({ success: false, message: "An error occurred", data: {} });
});

module.exports = router;

//http://localhost:3021/api/v1/auth/google/callback?code=4%2F0AY0e-g7Y9UFV0fedu5PaMOimQGNrkn0OA5B1q7L-Sreldaj4H7dSFDBxMlkZl-DSFo5n3A&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+openid&authuser=1&prompt=consent#

//http://localhost:3021/api/v1/auth/facebook/callback?code=AQBNlA9u10po7Az3zCrpK0cbqMSr6yA85coDQvAPYN17Z540SPBXasjKJ1Y-JMxIgAfL6-QomtMrJgsl8g6InRtVkhik0MVP-rCM6g_fmwV2f0OSe7aVjWIKHYKsO_t1KxIZ-CEX4mzf82wrMB3sKzMsU7bqb9lzRZXOExb82wu_kVc5YV-fkyitG4WDSEbjrkzcYLlM5IPAPQXdwwU1qnLRxEDedsEkZGMhWHa5-zBSgk-1bLiRWC3c58p-5eJ5pvQzLM7ByPA1Gnhyy7OtrkZOV7dlTGPAw8XmCVel0XtZi1nJeJb96Zd4pi6M5v0LsEwa0YDWUxW6UAJh8UDRfA5G#_=_
