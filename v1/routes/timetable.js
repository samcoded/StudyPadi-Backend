const express = require("express");
const router = express.Router();
const {
  getTimetables,
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} = require("../controllers/timetable.js");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/", verifyToken, getTimetables);
router.get("/:id", verifyToken, getTimetable);
router.post("/", verifyToken, createTimetable);
router.patch("/:id", verifyToken, updateTimetable);
router.delete("/:id", verifyToken, deleteTimetable);

module.exports = router;
