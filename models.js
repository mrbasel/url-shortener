const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Link extends Model {}

Link.init(
  {
    url_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    destination_url: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    clicks_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
  }
);

module.exports = {
  sequelize,
  Link,
};
