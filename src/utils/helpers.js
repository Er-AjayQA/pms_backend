const { Organization, Role } = require("../database/models/index");
const createError = require("http-errors");
const crypto = require("crypto");

// HELPER FUNCTIONS
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const getOrgDetails = async (orgSlug) => {
  const orgData = await Organization.findOne({
    where: { slug: orgSlug, deletedAt: null },
  });

  if (!orgData) {
    throw createError(404, "Organization not found");
  }

  return orgData;
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

module.exports = { hashToken, getOrgDetails, getRoleDetails };
