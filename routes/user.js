const express = require("express");
const router = express.Router();
const { login, register, getuser, updateuser } = require("../controllers/user");
const { verifytoken } = require("../middlewares/verifytoken");

router.post("/login", login);
router.post("/register", register);
router.get("/", verifytoken, getuser);
router.patch("/", verifytoken, updateuser);

module.exports = router;
