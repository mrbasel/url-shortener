const express = require("express");
const AuthController = require("../controllers/auth");

const router = express.Router();

router.post("/register", AuthController.createAccount);
router.post("/delete", AuthController.deleteAccount);
router.post("/login", AuthController.loginUser);
router.post("/logout", AuthController.logoutUser);

module.exports = router;
