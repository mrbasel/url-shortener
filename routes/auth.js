const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { User } = require("../models.js");
const { isAnonymous } = require("../helpers.js");

const router = express.Router();

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

router.get("/login", isAnonymous, function (req, res, next) {
  res.render("login.html");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/account",
    failureRedirect: "/auth/login",
  })
);

router.get("/register", isAnonymous, function (req, res, next) {
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
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await User.findByPk(id);
  done(null, user);
});

module.exports = router;
