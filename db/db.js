const pgp = require("pg-promise")();
const { PreparedStatement: PS, QueryFile } = require("pg-promise");

const { join: joinPath } = require("path");

const db = pgp(process.env.DATABASE_URL);

exports.createTables = async function () {
  const fullPath = joinPath(__dirname, "/sql/createTables.sql");
  const createTablesQuery = new QueryFile(fullPath);
  return await db.none(createTablesQuery);
};

exports.links = {
  get: async function (urlToken) {
    const getLinkStatement = new PS({
      name: "get-link",
      text: "SELECT * FROM links WHERE url_id = $1",
      values: [urlToken],
    });

    return db.oneOrNone(getLinkStatement);
  },
  add: function (url, urlToken) {
    const addLinkStatement = new PS({
      name: "add-link",
      text: "INSERT INTO links(url_id, destination_url) VALUES ($1, $2)",
      values: [urlToken, url],
    });
    return db.oneOrNone(addLinkStatement);
  },
};
