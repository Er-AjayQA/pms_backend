const { Organization, OrganizationMember } = require("../../database/models");
const createError = require("http-errors");
const generateSlug = require("../../utils/generateSlug");
const { Op } = require("sequelize");
const { getRoleDetails } = require("../../utils/helpers");

const createOrganization = async ({ name, ownerId, logoUrl }) => {
  const slug = generateSlug(name);
  const existingOrg = await Organization.findOne({
    where: { slug, deletedAt: null },
  });

  if (existingOrg) {
    throw createError(409, "Organization slug already exists");
  }

  const organization = await Organization.create({
    name,
    slug,
    ownerId,
    logoUrl,
  });

  const ownerRole = await getRoleDetails({
    name: "Owner",
  });

  const registerAsMember = await OrganizationMember.create({
    organizationId: organization.id,
    userId: ownerId,
    roleId: ownerRole.id,
    joinedAt: new Date(),
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

const updateOrganization = async (slug, { name, ownerId, logoUrl, status }) => {
  const existingOrg = await Organization.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingOrg) {
    throw createError(409, "Organization not found");
  }

  const isNameChange = name && existingOrg.name !== name;

  const newSlug = isNameChange ? generateSlug(name) : existingOrg.slug;

  if (isNameChange) {
    const checkNewSlug = await Organization.findOne({
      where: {
        slug: newSlug,
        id: { [Op.ne]: existingOrg.id },
      },
    });

    if (checkNewSlug) {
      throw createError(409, "Organization slug already exists");
    }
  }

  await Organization.update(
    {
      name,
      slug: newSlug,
      ownerId,
      logoUrl,
      status,
    },
    {
      where: { id: existingOrg.id },
    },
  );

  return await Organization.findByPk(existingOrg.id);
};

const updateStatusOrganization = async (slug) => {
  const existingOrg = await Organization.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingOrg) {
    throw createError(409, "Organization not found");
  }

  await Organization.update(
    {
      status: existingOrg?.status === "active" ? "inactive" : "active",
    },
    {
      where: { id: existingOrg.id },
    },
  );

  return await Organization.findByPk(existingOrg.id);
};

const deleteOrganization = async (slug) => {
  const existingOrg = await Organization.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingOrg) {
    throw createError(409, "Organization not found");
  }

  await Organization.update(
    {
      deletedAt: new Date(),
    },
    {
      where: { id: existingOrg.id },
    },
  );

  return await Organization.findByPk(existingOrg.id);
};

module.exports = {
  createOrganization,
  getBySlugOrganization,
  getOrganizations,
  updateOrganization,
  deleteOrganization,
  updateStatusOrganization,
};
