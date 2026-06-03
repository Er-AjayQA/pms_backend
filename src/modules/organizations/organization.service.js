const { Organization } = require("../../database/models");
const createError = require("http-errors");
const generateSlug = require("../../utils/generateSlug");

const createOrganization = async ({ name, ownerId, logoUrl }) => {
  const slug = generateSlug(name);
  const existingOrg = await Organization.findOne({ where: { slug } });

  if (existingOrg) {
    throw createError(409, "Organization slug already exists");
  }

  const organization = await Organization.create({
    name,
    slug,
    ownerId,
    logoUrl,
  });

  return organization;
};

module.exports = { createOrganization };
