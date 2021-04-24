const passport = require("passport");

const googleAuth = () => {
  passport.authenticate("google", {
    scope: ["email", "profile"],
  });
};

const googleAuthCallback = () => {
  passport.authenticate("google", {
    failureRedirect: "/api/v1/auth/error",
  });
};

const facebookAuth = () => {
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  });
};

const facebookAuthCallback = () => {
  passport.authenticate("facebook", {
    failureRedirect: "/api/v1/auth/error",
  });
};

module.exports = {
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
};
