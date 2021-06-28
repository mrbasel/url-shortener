const express = require("express");
const { nanoid } = require("nanoid");

const { isValidUrl } = require("../helpers.js");
const db = require("../db/db.js");

const router = express.Router();

// Create link route
router.post("/", async function (req, res, next) {
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
    const linkData = await db.links.add(url, urlToken);
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

module.exports = router;
