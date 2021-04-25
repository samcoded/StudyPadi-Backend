const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  registerAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  changeAdminPassword,
} = require("../controllers/admin.js");
const { verifyToken } = require("../middlewares/verifyToken.js");

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.get("/:id", verifyToken, getAdmin);
router.get("/", verifyToken, getAllAdmins); //Super admin exclusive
router.patch("/", verifyToken, updateAdmin);
router.delete("/:id", verifyToken, deleteAdmin); //Super admin exclusive
router.post("/changepassword", verifyToken, changeAdminPassword);

module.exports = router;
