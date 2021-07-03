const { URL } = require("url");

module.exports.isValidUrl = function (url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) return res.redirect("/auth/login");
  next();
};

module.exports.isAnonymous = function (req, res, next) {
  if (req.isAuthenticated()) return res.redirect("/");
  next();
};
