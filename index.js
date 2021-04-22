const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//API version 1 routes
const apiv1 = require("./v1/index");
app.use("/api/v1", apiv1);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//database connection
const CONNECTION_URL = process.env.MONGOURL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("Database connected"))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set("useFindAndModify", false);

//server listen
app.listen(PORT, () =>
  console.log(`Server Running on Port: http://localhost:${PORT}`)
);
