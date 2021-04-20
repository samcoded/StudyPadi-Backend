const express = require("express");
const router = express.Router();
const {
  login,
  register,
  getUser,
  updateUser,
  uploadProfilePic,
} = require("../controllers/user.js");
const { verifyToken } = require("../middlewares/verifyToken.js");

router.post("/login", login);
router.post("/register", register);
router.get("/", verifyToken, getUser);
router.patch("/", verifyToken, updateUser);
router.put("/add-profile-picture", verifyToken, uploadProfilePic);

module.exports = router;
