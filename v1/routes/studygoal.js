const express = require("express");
const router = express.Router();
const {
  getStudygoals,
  getStudygoal,
  createStudygoal,
  updateStudygoal,
  deleteStudygoal,
} = require("../controllers/studygoal.js");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/", verifyToken, getStudygoals);
router.get("/:id", verifyToken, getStudygoal);
router.post("/", verifyToken, createStudygoal);
router.patch("/:id", verifyToken, updateStudygoal);
router.delete("/:id", verifyToken, deleteStudygoal);

module.exports = router;
