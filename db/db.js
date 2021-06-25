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
  get: async function (urlToken, increment = false) {
    let queryText = "SELECT * FROM links WHERE url_id = $1";
    let statementName = "get-link";
    if (increment) {
      statementName = "getUpdate-link";
      queryText =
        "UPDATE links SET clicks_count = clicks_count + 1 WHERE url_id = $1 RETURNING *";
    }

    const getLinkStatement = new PS({
      name: statementName,
      text: queryText,
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
