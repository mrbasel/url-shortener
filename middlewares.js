const validator = require("validator");
const { User } = require("./models.js");

module.exports.isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) return res.status(401).json();
  next();
};

module.exports.isAnonymous = function (req, res, next) {
  if (req.isAuthenticated()) return res.status(401).json();
  next();
};

module.exports.isAuthorized = async function (req, res, next) {
  const apiKey = req.get("x-api-key");
  const isValidKey = validator.isUUID(apiKey);

  if (!isValidKey)
    return res.status(400).json({
      status: "fail",
      message: "Unvalid api key",
    });

  try {
    const user = await User.findOne({
      where: {
        apiKey: apiKey,
      },
    });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Unvalid api key",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong, try again later",
    });
  }

  next();
};
