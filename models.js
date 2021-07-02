const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
});

class Link extends Model {}
class User extends Model {}

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

User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
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
  User,
};
