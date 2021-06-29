const express = require("express");
const { nanoid } = require("nanoid");

const { isValidUrl } = require("../helpers.js");
const { Link } = require("../models.js");

const router = express.Router();

router.get("/", function (req, res, next) {
  const errors = req.cookies["err"];
  res.clearCookie("err", { httpOnly: true });

  res.render("index.html", { title: "Express", errors: errors });
});

router.get("/url/:token", async function (req, res, next) {
  const urlId = req.params.token;
  const link = `${req.protocol}://${req.get("host")}/${urlId}`;

  const linkData = await Link.findOne({
    where: {
      urlId: urlId,
    },
  });

  if (linkData == null) {
    res.locals.msg = "This link does not exist";
    return next();
  }

  res.render("link.html", {
    title: "Express",
    link: link,
    clicks: linkData.clicksCount,
  });
});

router.get("/:urlId", async function (req, res, next) {
  const urlId = req.params.urlId;

  const link = await Link.findOne({
    where: {
      urlId: urlId,
    },
  });
  if (link == null) {
    res.locals.msg = "This link does not exist";
    next();
  } else {
    link.clicksCount++;
    await link.save();
    res.redirect(link.destinationUrl);
  }
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
    const urlId = nanoid(8);
    await Link.create({
      destinationUrl: url,
      urlId: urlId,
    });

    res.redirect("/url/" + urlId);
  }
});

module.exports = router;
