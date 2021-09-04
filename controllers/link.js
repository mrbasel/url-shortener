const express = require("express");
const { nanoid } = require("nanoid");

const { isValidUrl } = require("../validators.js");
const { Link } = require("../models.js");

class LinkController {
  shortenLink(req, res, next) {
    const url = req.body.url;

    if (!isValidUrl(url)) {
      return res.status(400).json({
        status: "fail",
        msg: "Unvalid url",
      });
    }

    const urlId = nanoid(8);
    if (req.user) {
      const link = await Link.create({
        destinationUrl: url,
        urlId: urlId,
        userId: req.user.id,
      });
      await req.user.addLink(link);
    } else {
      await Link.create({
        destinationUrl: url,
        urlId: urlId,
      });
    }

    res.json({
      status: "success",
      data: {
        link: `${req.get("host")}/${urlId}`,
      },
    });
  }

  async getLinks(req, res, next) {
    const links = await req.user.getLinks({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      status: "success",
      data: {
        links: links,
      },
    });
  }

  updateLink(req, res, next) {
    const newDestinationUrl = req.body.link;
    const urlId = req.body.linkId;

    const link = await Link.findOne({
      where: {
        urlId: urlId,
        user_id: req.user.id,
      },
    });

    if (!link)
      return res.status(404).json({
        status: "fail",
        msg: "Link doesn't exist",
      });

    link.destinationUrl = newDestinationUrl;
    res.json({
      status: "success",
      data: {
        link: `${req.get("host")}/${urlId}`,
      },
    });
  }

  deleteLink(req, res, next) {
    const urlId = req.body.id;

    await Link.destroy({
      where: {
        urlId: urlId,
        user_id: req.user.id,
      },
    });

    res.json({
      status: "success",
    });
  }
}

module.exports = LinkController;
