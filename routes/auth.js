const express = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const { User } = require("../models.js");
const { isAnonymous } = require("../middlewares.js");
const configurePassport = require("../passport-conf.js");

const router = express.Router();

// Configure local strategy and serialization/deserialization
configurePassport(passport);

router.get("/login", isAnonymous, function (req, res, next) {
  res.render("login.html", { error: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/account",
    failureRedirect: "/auth/login",
    failureFlash: "Invalid username or password",
  })
);

router.get("/register", isAnonymous, function (req, res, next) {
  const errors = req.flash("error");
  res.render("register.html", { error: errors });
});

router.post(
  "/register",
  body("username")
    .isLength({ min: 4, max: 20 })
    .withMessage("Username must be between 4 and 20 characters"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters long"),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array());
      return res.redirect("/auth/register");
    }
    next();
  },
  async function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      await User.create({
        username: username,
        password: await bcrypt.hash(password, 10),
      });
      res.redirect("/auth/login");
    } else {
      req.flash("error", [{ msg: "The username is already picked" }]);
      res.redirect("/auth/register");
    }
  }
);

router.get("/logout", function (req, res, next) {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
