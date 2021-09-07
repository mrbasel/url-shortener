const passport = require("passport");
const bcrypt = require("bcrypt");

const { User } = require("../models.js");

class AuthController {
  static async createAccount(req, res, next) {
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

      res.status(201).json({
        status: "success",
        msg: "Account created successfuly",
      });
    } else {
      res.status(401).json({
        status: "fail",
        msg: "This username is already taken, please choose another one.",
      });
    }
  }

  static async deleteAccount(req, res, next) {
    await User.destroy({
      where: {
        id: req.user.id,
      },
    });

    res.json({
      status: "success",
      msg: "Account deleted successfuly",
    });
  }

  static loginUser(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;

      if (!user) {
        res
          .status(401)
          .json({ status: "fail", msg: "Wrong username or password" });
      } else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res
            .status(200)
            .json({ msg: "Successfully Authenticated", status: "success" });
        });
      }
    })(req, res, next);
  }

  static logoutUser(req, res, next) {
    req.logOut();

    res.json({
      status: "success",
    });
  }
}

module.exports = AuthController;
