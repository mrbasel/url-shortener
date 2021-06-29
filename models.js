const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Link extends Model {}

Link.init(
  {
    urlId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    destinationUrl: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    clicksCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
  }
);

module.exports = {
  sequelize,
  Link,
};
