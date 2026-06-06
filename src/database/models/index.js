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
db.Role = require("../../modules/roles/roles.model")(
  sequelize,
  Sequelize.DataTypes,
);
db.OrganizationMember =
  require("../../modules/organizationMembers/organizationMembers.model")(
    sequelize,
    Sequelize.DataTypes,
  );
db.Invitation = require("../../modules/invitations/invitations.model")(
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
  as: "owner",
});

// Role & Organization tables associations
db.Organization.hasMany(db.Role, {
  foreignKey: "organizationId",
  as: "roles",
});
db.Role.belongsTo(db.Organization, {
  foreignKey: "organizationId",
  as: "organization",
});

// Organization & Organization Member tables associations
db.Organization.hasMany(db.OrganizationMember, {
  foreignKey: "organizationId",
  as: "members",
});
db.OrganizationMember.belongsTo(db.Organization, {
  foreignKey: "organizationId",
  as: "organization",
});

// User & Organization Member tables associations
db.User.hasMany(db.OrganizationMember, {
  foreignKey: "userId",
  as: "organizationMemberships",
});
db.OrganizationMember.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});

// Role & Organization Member tables associations
db.Role.hasMany(db.OrganizationMember, {
  foreignKey: "roleId",
  as: "members",
});
db.OrganizationMember.belongsTo(db.Role, {
  foreignKey: "roleId",
  as: "role",
});

// Organization & Invitation tables associations
db.Organization.hasMany(db.Invitation, {
  foreignKey: "organizationId",
  as: "invitations",
});
db.Invitation.belongsTo(db.Organization, {
  foreignKey: "organizationId",
  as: "organization",
});

// Role & Invitation tables associations
db.Role.hasMany(db.Invitation, {
  foreignKey: "roleId",
  as: "invitations",
});
db.Invitation.belongsTo(db.Role, {
  foreignKey: "roleId",
  as: "role",
});

module.exports = db;
