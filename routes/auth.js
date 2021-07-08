const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");

const { User } = require("../models.js");
const { isAnonymous } = require("../middlewares.js");
const configurePassport = require("../passport-conf.js");

const router = express.Router();

// Configure local strategy and serialization/deserialization
configurePassport(passport);

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

router.get("/logout", function (req, res, next) {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
