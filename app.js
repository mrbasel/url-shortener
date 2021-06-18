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

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

module.exports = app;
