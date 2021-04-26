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
  activateAdmin,
  roleAdmin,
} = require("../controllers/admin.js");
const {
  verifyToken,
  verifyAdmin,
  verifySuperAdmin,
} = require("../middlewares/verify.js");

router.post("/login", loginAdmin);

//LOGGED IN ADMINS
router.get("/", verifyToken, verifyAdmin, getAdmin);
router.patch("/", verifyToken, verifyAdmin, updateAdmin);
router.post("/changepassword", verifyToken, verifyAdmin, changeAdminPassword);

//SUPER ADMIN
router.post("/register", verifyToken, verifySuperAdmin, registerAdmin);
router.get("/:id", verifyToken, verifyAdmin, getAdmin);
router.get("/all", verifyToken, verifySuperAdmin, getAllAdmins);
router.patch("/:id", verifyToken, verifyAdmin, updateAdmin);
router.get("/activate/:id", verifyToken, verifySuperAdmin, activateAdmin);
router.get("/changerole/:id", verifyToken, verifySuperAdmin, roleAdmin);
router.post(
  "/changepassword/:id",
  verifyToken,
  verifySuperAdmin,
  changeAdminPassword
);
router.delete("/:id", verifyToken, verifySuperAdmin, deleteAdmin);

module.exports = router;
