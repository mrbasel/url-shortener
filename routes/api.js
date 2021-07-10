const express = require("express");
const { nanoid } = require("nanoid");

const { isValidUrl } = require("../validators.js");
const { Link } = require("../models.js");
const { isAuthorized } = require("../middlewares.js");

const router = express.Router();

// Create link route
router.post("/trim", isAuthorized, async function (req, res, next) {
  const url = req.body.url;

  if (!isValidUrl(url)) {
    let msg = "unvalid URL";
    if (url === "" || url == undefined) msg = "URL missing";

    return res.status(400).json({
      status: "fail",
      message: msg,
    });
  }

  const urlToken = nanoid(8);
  try {
    await Link.create({
      destinationUrl: url,
      urlId: urlToken,
    });
    const link = `${req.protocol}://${req.get("host")}/${urlToken}`;

    res.status(200).json({
      status: "success",
      data: {
        link: link,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong, try again later",
    });
  }
});

module.exports = router;
