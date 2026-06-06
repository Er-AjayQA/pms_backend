const { Organization, Role } = require("../database/models/index");
const createError = require("http-errors");
const crypto = require("crypto");

// HELPER FUNCTIONS
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const getProjectDetails = async (whereCondition) => {
  const data = await Project.findOne(whereCondition);

  if (!data) {
    throw createError(404, "Project not found");
  }

  return data;
};

const getRoleDetails = async (whereCondition) => {
  const data = await Role.findOne({
    where: whereCondition,
  });

  if (!data) {
    throw createError(404, "Role not found");
  }

  return data;
};

module.exports = { hashToken, getProjectDetails, getRoleDetails };
