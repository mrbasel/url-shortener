const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const nunjucks = require("nunjucks");

const indexRouter = require("./routes/index");

const app = express();

// setup view engine
app.set("view engine", "nunjucks");
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render("error.html");
});

app.use(function (req, res, next) {
  res.status(404).render("404.html");
});

module.exports = app;
