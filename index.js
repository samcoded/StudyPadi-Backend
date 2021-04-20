const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
// const timetablerouter = require("./routes/timetable");
// const schedulerouter = require("./routes/schedule");
// const goalrouter = require("./routes/goal");
// const badgerouter = require("./routes/badge");
const home = require("./controllers/home");

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//Routes
app.get("/api", home);
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
// app.use("/api/timetable", timetablerouter);
// app.use("/api/schedule", schedulerouter);
// app.use("/api/goal", goalrouter);
// app.use("/api/badge", badgerouter);

const CONNECTION_URL = process.env.MONGOURL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("Database connected"))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);

app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}`)
);
