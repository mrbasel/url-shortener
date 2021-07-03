const express = require("express");
const { nanoid } = require("nanoid");

const { isValidUrl } = require("../helpers.js");
const { Link, User } = require("../models.js");

const router = express.Router();

// Create link route
router.post("/", isAuthorized, async function (req, res, next) {
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
    console.log(e);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong, try again later",
    });
  }
});

async function isAuthorized(req, res, next) {
  const apiKey = req.get("x-api-key");

  if (!apiKey)
    return res.status(401).json({
      status: "fail",
      message: "No api key provided",
    });

  try {
    const user = await User.findOne({
      where: {
        apiKey: apiKey,
      },
    });

    if (!user) {
      res.status(400).end();
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong, try again later",
    });
  }

  next();
}

module.exports = router;
