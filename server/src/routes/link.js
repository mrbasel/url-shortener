const express = require("express");
const LinkController = require("../controllers/link");
const { isLoggedIn } = require("../middlewares");

const router = express.Router();

router.get("/:urlId", LinkController.visitLink);

router.get("/links", isLoggedIn, LinkController.getLinks);
router.post("/trim", LinkController.shortenLink);
router.put("/links/:id", isLoggedIn, LinkController.updateLink);
router.delete("/links/:id", isLoggedIn, LinkController.deleteLink);

module.exports = router;
