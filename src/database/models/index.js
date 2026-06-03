const { Sequelize } = require("sequelize");
const config = require("../../config/database");
const env = require("../../config/env");

const dbConfig = config[env.NODE_ENV];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig,
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("../../modules/users/user.model")(
  sequelize,
  Sequelize.DataTypes,
);
db.RefreshToken = require("../../modules/auth/refresh-token.model")(
  sequelize,
  Sequelize.DataTypes,
);
db.Organization = require("../../modules/organizations/organization.model")(
  sequelize,
  Sequelize.DataTypes,
);

// User & Refresh Token tables associations
db.User.hasMany(db.RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
});
db.RefreshToken.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});

// User & Organization tables associations
db.User.hasMany(db.Organization, {
  foreignKey: "ownerId",
  as: "organizations",
});
db.Organization.belongsTo(db.User, {
  foreignKey: "ownerId",
  as: "user",
});

module.exports = db;
