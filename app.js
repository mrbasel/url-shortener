const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const nunjucks = require("nunjucks");
const passport = require("passport");
const session = require("express-session");
const helmet = require("helmet");

// Load enviroment vars from .env file if in dev enviroment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");
const { sequelize } = require("./models.js");

const app = express();

// setup view engine
app.set("view engine", "nunjucks");
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

// synchronize all models in db
sequelize.sync();

app.use(logger(process.env.NODE_ENV !== "production" ? "dev" : "combined"));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: "auto",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/api", apiRouter);

app.use(function (err, req, res, next) {
  if (err instanceof SyntaxError) {
    res.locals.json = true;
    next(err);
  }
});

app.use(function (err, req, res, next) {
  console.log(res.locals.json);
  console.error(err.stack);
  if (res.locals.json)
    res.status(500).json({
      status: "error",
      message: "Something went wrong, try again later",
    });
  else res.status(500).render("error.html");
});

app.use(function (req, res, next) {
  res.status(404).render("404.html");
});

module.exports = app;
