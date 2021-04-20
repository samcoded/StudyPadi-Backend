const express = require("express");
const router = express.Router();
const {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/schedule.js");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/", verifyToken, getSchedules);
router.get("/:id", verifyToken, getSchedule);
router.post("/", verifyToken, createSchedule);
router.patch("/:id", verifyToken, updateSchedule);
router.delete("/:id", verifyToken, deleteSchedule);

module.exports = router;
