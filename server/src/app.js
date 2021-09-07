const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const nunjucks = require("nunjucks");
const passport = require("passport");
const session = require("express-session");
const helmet = require("helmet");
const flash = require("connect-flash");

// Load enviroment vars from .env file if in dev enviroment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const linkRouter = require("./routes/link");
const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");
const { sequelize } = require("./models.js");
const configurePassport = require("./passport-conf");

const app = express();

// synchronize all models in db
sequelize.sync();

app.use(logger(process.env.NODE_ENV !== "production" ? "dev" : "combined"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser(process.env.secret));
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: "auto",
      maxAge: 60000,
    },
  })
);
app.use(passport.initialize());
configurePassport(passport);
app.use(passport.session());
app.use(flash());

app.use("/", linkRouter);
app.use("/auth", authRouter);
// app.use("/api", apiRouter);

app.use(function (req, res, next) {
  res.status(404).end();
});

module.exports = app;
