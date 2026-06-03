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

const getBySlugOrganization = async (slug) => {
  const existingOrg = await Organization.findOne({
    where: { slug, deletedAt: null },
    include: [
      {
        association: "owner",
        attributes: {
          exclude: [
            "passwordHash",
            "lastLoginAt",
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
        where: { status: "active" },
      },
    ],
  });

  if (!existingOrg) {
    throw createError(404, "Organization not found");
  }

  return existingOrg;
};

const getOrganizations = async (slug) => {
  const orgList = await Organization.findAll({
    where: { deletedAt: null },
    include: [
      {
        association: "owner",
        attributes: {
          exclude: [
            "passwordHash",
            "lastLoginAt",
            "createdAt",
            "updatedAt",
            "deletedAt",
          ],
        },
        where: { status: "active" },
      },
    ],
  });

  if (orgList?.length === 0) {
    throw createError(404, "Organizations not found");
  }

  return orgList;
};

module.exports = {
  createOrganization,
  getBySlugOrganization,
  getOrganizations,
};
