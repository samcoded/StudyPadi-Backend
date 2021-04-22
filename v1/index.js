//API VERSION 1
const express = require("express");
const router = express.Router();

const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
const timetableRouter = require("./routes/timetable");
const scheduleRouter = require("./routes/schedule");
const studygoalRouter = require("./routes/studygoal");
const authRouter = require("./routes/auth");
const welcome = require("./controllers/welcome");

//Routes
router.get("/", welcome);
router.use("/user", userRouter);
router.use("/task", taskRouter);
router.use("/timetable", timetableRouter);
router.use("/schedule", scheduleRouter);
router.use("/studygoal", studygoalRouter);
router.use("/auth", authRouter);

module.exports = router;
