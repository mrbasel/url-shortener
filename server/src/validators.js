const { URL } = require("url");

module.exports.isValidUrl = function (url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
