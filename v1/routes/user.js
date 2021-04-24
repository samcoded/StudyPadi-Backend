const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  getUser,
  updateUser,
  changeUserPassword,
  passwordReset,
  checkResetCode,
  passwordResetConfirm,
  uploadProfilePic,
  addBadge,
  getBadges,
} = require("../controllers/user.js");
const { verifyToken } = require("../middlewares/verifyToken.js");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/", verifyToken, getUser);
router.patch("/", verifyToken, updateUser);
router.post("/changepassword", verifyToken, changeUserPassword);
router.post("/resetpassword", passwordReset);
router.post("/checkresetcode", checkResetCode);
router.post("/resetpassword/confirm", passwordResetConfirm);
router.put("/uploadpicture", verifyToken, uploadProfilePic);
router.post("/addbadge", verifyToken, addBadge);
router.get("/badges", verifyToken, getBadges);

module.exports = router;
