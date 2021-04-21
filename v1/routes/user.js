const express = require("express");
const router = express.Router();
const {
  login,
  register,
  getUser,
  updateUser,
  uploadProfilePic,
  changePassword,
  setResetToken,
  checkResetToken,
  resetPassword,
  addBadge,
  getBadges,
} = require("../controllers/user.js");
const { verifyToken } = require("../middlewares/verifyToken.js");

router.post("/login", login);
router.post("/register", register);
router.get("/", verifyToken, getUser);
router.patch("/", verifyToken, updateUser);
router.put("/add-profile-picture", verifyToken, uploadProfilePic);
router.post("/changepassword", verifyToken, changePassword);
router.post("/recover", setResetToken);
router.post("/checktoken", checkResetToken);
router.post("/resetpassword", resetPassword);
router.post("/addbadge", verifyToken, addBadge);
router.post("/badges", verifyToken, getBadges);

module.exports = router;
