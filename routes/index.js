const express = require("express");
const pgp = require("pg-promise")();
const { nanoid } = require("nanoid");

const db = pgp(process.env.DATABASE_URL);
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("index.html", { title: "Express" });
});

router.get("/url/:token", function (req, res, next) {
  const link = `${req.protocol}://${req.get("host")}/${req.params.token}`;
  res.render("link.html", { title: "Express", link: link });
});

router.get("/:urlId", async function (req, res, next) {
  const urlId = req.params.urlId;

  const linkData = await db.oneOrNone(
    "SELECT * FROM links WHERE url_id = $1",
    urlId
  );
  if (linkData == null) res.redirect("/");
  else res.redirect(linkData.destination_url);
});

router.post("/", function (req, res, next) {
  const url = req.body.url;
  if (!url) res.status(500).end();

  const urlToken = nanoid(8);
  db.any("INSERT INTO links(url_id, destination_url) VALUES ($1, $2)", [
    urlToken,
    url,
  ]);

  res.redirect("/url/" + urlToken);
});

module.exports = router;
