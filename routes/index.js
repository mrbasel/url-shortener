const express = require("express");
const { nanoid } = require("nanoid");

const { isValidUrl } = require("../helpers.js");

const router = express.Router();
const db = require("../db/db.js");

router.get("/", function (req, res, next) {
  const errors = req.cookies["err"];
  res.clearCookie("err", { httpOnly: true });

  res.render("index.html", { title: "Express", errors: errors });
});

router.get("/url/:token", async function (req, res, next) {
  const urlId = req.params.token;
  const link = `${req.protocol}://${req.get("host")}/${urlId}`;

  const linkData = await db.links.get(urlId, false);

  if (linkData == null) {
    res.locals.msg = "This link does not exist";
    return next();
  }

  res.render("link.html", {
    title: "Express",
    link: link,
    clicks: linkData.clicks_count,
  });
});

router.get("/:urlId", async function (req, res, next) {
  const urlId = req.params.urlId;

  const linkData = await db.links.get(urlId, true);
  if (linkData == null) {
    res.locals.msg = "This link does not exist";
    next();
  } else res.redirect(linkData.destination_url);
});

router.post("/", async function (req, res, next) {
  const url = req.body.url;

  if (!isValidUrl(url)) {
    res.cookie("err", "Invalid URL");
    res.redirect("/");
    return;
  }

  if (url === "" || url == undefined) res.status(400).send("URL missing");
  else {
    const urlToken = nanoid(8);
    await db.links.add(url, urlToken);

    res.redirect("/url/" + urlToken);
  }
});

module.exports = router;
