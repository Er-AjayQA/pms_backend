const { Organization, Role } = require("../../database/models");
const createError = require("http-errors");
const generateSlug = require("../../utils/generateSlug");
const { Op, where } = require("sequelize");

// HELPER FUNCTIONS
const getOrgDetails = async (orgSlug) => {
  const orgData = await Organization.findOne({
    where: { slug: orgSlug, deletedAt: null },
  });

  if (!orgData) {
    throw createError(404, "Organization not found");
  }

  return orgData;
};

const getRoleDetails = async (slug, orgId) => {
  const data = await Role.findOne({
    where: { slug, organizationId: orgId, deletedAt: null },
  });

  if (!data) {
    throw createError(404, "Role not found");
  }

  return data;
};

// SERVICES
const createRole = async (orgSlug, { name, description, isSystem }) => {
  const orgData = await getOrgDetails(orgSlug);

  const roleSlug = generateSlug(name);

  const existingData = await Role.findOne({
    where: { slug: roleSlug, organizationId: orgData?.id, deletedAt: null },
  });

  if (existingData) {
    throw createError(409, "Role slug already exists");
  }

  const data = await Role.create({
    organizationId: orgData?.id,
    name,
    slug: roleSlug,
    description,
    isSystem,
  });

  return data;
};

const getBySlugRole = async ({ orgSlug, slug }) => {
  const orgData = await getOrgDetails(orgSlug);

  const existingData = await Role.findOne({
    where: {
      slug,
      deletedAt: null,
      [Op.or]: [
        { organizationId: orgData?.id },
        { organizationId: null, isSystem: true },
      ],
    },
  });

  if (!existingData) {
    throw createError(404, "Data not found");
  }

  return existingData;
};

const getRoles = async (orgSlug) => {
  const orgData = await getOrgDetails(orgSlug);

  const dataList = await Role.findAll({
    where: {
      deletedAt: null,
      [Op.or]: [
        {
          organizationId: org.id,
        },
        {
          organizationId: null,
          isSystem: true,
        },
      ],
    },
  });

  if (dataList?.length === 0) {
    throw createError(404, "Roles not found");
  }

  return dataList;
};

const updateRole = async (
  { orgSlug, slug },
  { organizationId, name, description, isSystem, status },
) => {
  const orgData = await getOrgDetails(orgSlug);

  const existingData = await getRoleDetails(slug, orgData?.id);

  if (!existingData) {
    throw createError(409, "Data not found");
  }

  const isNameChange = name && existingData?.name !== name;

  const newSlug = isNameChange ? generateSlug(name) : existingData?.slug;

  if (isNameChange) {
    const checkNewSlug = await Role.findOne({
      where: {
        slug: newSlug,
        organizationId: orgData?.id,
        id: { [Op.ne]: existingData.id },
      },
    });

    if (checkNewSlug) {
      throw createError(409, "Name already exists");
    }
  }

  await Role.update(
    {
      Name,
      organizationId,
      slug: newSlug,
      description,
      isSystem,
      status,
    },
    {
      where: { id: existingData.id },
    },
  );

  return await Role.findByPk(existingData.id);
};

const updateStatusRole = async (slug) => {
  const existingData = await Role.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingData) {
    throw createError(409, "Role not found");
  }

  await Role.update(
    {
      status: existingData?.status === "active" ? "inactive" : "active",
    },
    {
      where: { id: existingData.id },
    },
  );

  return await Role.findByPk(existingData.id);
};

const deleteRole = async (slug) => {
  const existingData = await Role.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingData) {
    throw createError(409, "Data not found");
  }

  await Role.update(
    {
      deletedAt: new Date(),
    },
    {
      where: { id: existingData.id },
    },
  );

  return await Role.findByPk(existingData.id);
};

module.exports = {
  createRole,
  getBySlugRole,
  getRoles,
  updateRole,
  updateStatusRole,
  deleteRole,
};
