const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  changeUserPassword,
  passwordReset,
  checkResetCode,
  passwordResetConfirm,
  uploadProfilePic,
  addBadge,
  getBadges,
} = require("../controllers/user.js");
const { verifyToken, verifyAdmin } = require("../middlewares/verify.js");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/resetpassword", passwordReset);
router.post("/checkresetcode", checkResetCode);
router.post("/resetpassword/confirm", passwordResetConfirm);
router.put("/uploadpicture", verifyToken, uploadProfilePic);

//LOGGED IN USERS
router.patch("/", verifyToken, updateUser);
router.post("/addbadge", verifyToken, addBadge);
router.get("/badges", verifyToken, getBadges);
router.get("/", verifyToken, getUser);
router.post("/changepassword/", verifyToken, changeUserPassword);

//ADMIN CONTROL
router.patch("/:id", verifyToken, verifyAdmin, updateUser);
router.post("/addbadge/:id", verifyToken, verifyAdmin, addBadge);
router.get("/badges/:id", verifyToken, verifyAdmin, getBadges);
router.get("/:id", verifyToken, verifyAdmin, getUser);
router.get("/all", verifyToken, verifyAdmin, getUsers);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);
router.post(
  "/changepassword/:id",
  verifyToken,
  verifyAdmin,
  changeUserPassword
);
router.put("/uploadpicture/:id", verifyToken, verifyAdmin, uploadProfilePic);

module.exports = router;
