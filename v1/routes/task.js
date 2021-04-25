const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  checkTask,
  deleteTask,
} = require("../controllers/task.js");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/", verifyToken, getTasks);
router.get("/:id", verifyToken, getTask);
router.post("/", verifyToken, createTask);
router.patch("/:id", verifyToken, updateTask);
router.get("/check/:id", verifyToken, checkTask);
router.delete("/:id", verifyToken, deleteTask);

module.exports = router;
