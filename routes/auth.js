const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { User } = require("../models.js");

const router = express.Router();

router.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ where: { username: username } });
      if (!user) return done(null, false);
      else if (await bcrypt.compare(password, user.password))
        return done(null, user);

      return done(null, false);
    } catch (e) {
      return done(e);
    }
  })
);

router.get("/login", function (req, res, next) {
  res.render("login.html");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

router.get("/register", function (req, res, next) {
  res.render("register.html");
});

router.post("/register", async function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  await User.create({
    username: username,
    password: await bcrypt.hash(password, 10),
  });

  res.redirect("/auth/login");
});

passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  console.log(user);
  const user = await User.findByPk(id);
  done(err, user);
});

module.exports = router;
