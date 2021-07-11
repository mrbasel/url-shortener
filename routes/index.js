const express = require("express");
const { nanoid } = require("nanoid");

const { isValidUrl } = require("../validators.js");
const { isLoggedIn } = require("../middlewares.js");
const { Link } = require("../models.js");

const router = express.Router();

router.use(function (req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

router.get("/", function (req, res, next) {
  const errors = req.cookies["err"];
  res.clearCookie("err", { httpOnly: true });

  res.render("index.html", { errors: errors });
});

router.get("/account", isLoggedIn, function (req, res, next) {
  res.render("account.html", {
    username: req.user.username,
    key: req.user.apiKey,
  });
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

    if (req.user) {
      const link = await Link.create({
        destinationUrl: url,
        urlId: urlId,
        userId: req.user.id,
      });
      await req.user.addLink(link);
    } else {
      await Link.create({
        destinationUrl: url,
        urlId: urlId,
      });
    }
    res.redirect("/url/" + urlId);
  }
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
    link.increment("clicksCount");
    res.redirect(link.destinationUrl);
  }
});

router.get("/url/:token", async function (req, res, next) {
  const urlId = req.params.token;
  const link = `${req.get("host")}/${urlId}`;

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
    originalUrl: linkData.destinationUrl,
    clicks: linkData.clicksCount,
  });
});

module.exports = router;
