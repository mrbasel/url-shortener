const express = require("express");
const { nanoid } = require("nanoid");

const { isValidUrl } = require("../validators.js");
const { Link } = require("../models.js");

class LinkController {
  static async visitLink(req, res, next) {
    const urlId = req.params.urlId;

    const link = await Link.findOne({
      where: {
        urlId: urlId,
      },
    });
    if (link == null) {
      next();
    } else {
      link.increment("clicksCount");
      res.redirect(link.destinationUrl);
    }
  }

  static async shortenLink(req, res, next) {
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

  static async getLinks(req, res, next) {
    const links = await req.user.getLinks({
      order: [["createdAt", "DESC"]],
      attributes: ["urlId", "clicksCount", "destinationUrl"],
    });

    res.json({
      status: "success",
      data: {
        links: links.map(
          (link) =>
            new Object({
              link: `${req.get("host")}/${link.urlId}`,
              clicksCount: link.clicksCount,
              destinationUrl: link.destinationUrl,
            })
        ),
      },
    });
  }

  static async updateLink(req, res, next) {
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

  static async deleteLink(req, res, next) {
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
