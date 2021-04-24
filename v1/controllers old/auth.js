// const passport = require("passport");
// const { googlePassport, facebookPassport } = require("../middlewares/auth.js");

// // Passport config
// googlePassport();
// facebookPassport();

// // passport.serializeUser(function (user, cb) {
// //   cb(null, user);
// // });

// // passport.deserializeUser(function (obj, cb) {
// //   cb(null, obj);
// // });

// const googleAuth = () => {
//   passport.authenticate("google", {
//     scope: ["https://www.googleapis.com/auth/plus.login"],
//   });
// };

// const googleAuthCallback = () => {
//   passport.authenticate("google", {
//     failureRedirect: "/error",
//   }),
//     (req, res) => {
//       res.redirect("/data");
//     };
// };
// const facebookAuth = () => {
//   passport.authenticate("facebook");
// };

// const facebookAuthCallback = () => {
//   passport.authenticate("facebook", {
//     failureRedirect: "/error",
//   }),
//     (req, res) => {
//       res.redirect("/data");
//     };
// };

const processData = async (type, data) => {
  if (!data) return false;
  if (type == "facebook") {
    const name = data.name;
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[1];
    const emailAddress = data.email;
    return { firstName, lastName, emailAddress };
  } else if (type == "google") {
    const firstName = data.given_name;
    const lastName = data.family_name;
    const emailAddress = data.email;
    return { firstName, lastName, emailAddress };
  } else {
    return false;
  }
};

const processError = async (req, res) => {
  res.send("error");
};

module.exports = {
  // googleAuth,
  // googleAuthCallback,
  // facebookAuth,
  // facebookAuthCallback,
  processData,
  processError,
};
