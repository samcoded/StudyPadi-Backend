//API VERSION 1
const express = require("express");
const router = express.Router();

const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
const timetableRouter = require("./routes/timetable");
const scheduleRouter = require("./routes/schedule");
const studygoalRouter = require("./routes/studygoal");
// const badgeRouter = require("./routes/badge");
const home = require("./controllers/home");

//Routes
router.get("/", home);
router.use("/user", userRouter);
router.use("/task", taskRouter);
router.use("/timetable", timetableRouter);
router.use("/schedule", scheduleRouter);
router.use("/studygoal", studygoalRouter);
// router.use("/badge", badgerouter);

module.exports = router;
