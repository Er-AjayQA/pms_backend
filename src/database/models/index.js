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
db.Project = require("../../modules/projects/projects.model")(
  sequelize,
  Sequelize.DataTypes,
);
db.Role = require("../../modules/roles/roles.model")(
  sequelize,
  Sequelize.DataTypes,
);
db.ProjectMember = require("../../modules/projectMembers/projectMembers.model")(
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

// User & Project tables associations
db.User.hasMany(db.Project, {
  foreignKey: "ownerId",
  as: "projects",
});
db.Project.belongsTo(db.User, {
  foreignKey: "ownerId",
  as: "owner",
});

// Project & Project Member tables associations
db.Project.hasMany(db.ProjectMember, {
  foreignKey: "projectId",
  as: "members",
});
db.ProjectMember.belongsTo(db.Project, {
  foreignKey: "projectId",
  as: "project",
});

// User & Project Member tables associations
db.User.hasMany(db.ProjectMember, {
  foreignKey: "userId",
  as: "ProjectMemberships",
});
db.ProjectMember.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});

// Role & Project Member tables associations
db.Role.hasMany(db.ProjectMember, {
  foreignKey: "roleId",
  as: "members",
});
db.ProjectMember.belongsTo(db.Role, {
  foreignKey: "roleId",
  as: "role",
});

// Project & Invitation tables associations
db.Project.hasMany(db.Invitation, {
  foreignKey: "projectId",
  as: "invitations",
});
db.Invitation.belongsTo(db.Project, {
  foreignKey: "projectId",
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
