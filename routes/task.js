const express = require("express");
const router = express.Router();
const {
  gettasks,
  gettask,
  createtask,
  updatetask,
  deletetask,
} = require("../controllers/task");
const { verifytoken } = require("../middlewares/verifytoken");

router.get("/", verifytoken, gettasks);
router.get("/:id", verifytoken, gettask);
router.post("/", verifytoken, createtask);
router.patch("/:id", verifytoken, updatetask);
router.delete("/:id", verifytoken, deletetask);

module.exports = router;
