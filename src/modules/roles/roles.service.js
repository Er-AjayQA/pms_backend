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

const getRoleDetails = async (whereCondition) => {
  const data = await Role.findOne({
    where: whereCondition,
  });

  if (!data) {
    throw createError(404, "Role not found");
  }

  return data;
};

// SERVICES
const createRole = async (orgSlug, { name, description, isSystem }) => {
  const orgData = await getOrgDetails(orgSlug);

  const existingData = await Role.findOne({
    where: {
      name,
      organizationId: isSystem ? null : orgData?.id,
      deletedAt: null,
    },
  });

  if (existingData) {
    throw createError(409, "Role name already exists");
  }

  const data = await Role.create({
    organizationId: isSystem ? null : orgData?.id,
    name,
    description,
    isSystem,
  });

  return data;
};

const getByIdRole = async (roleId) => {
  const existingData = await getRoleDetails({
    id: roleId,
    deletedAt: null,
  });

  if (!existingData) {
    throw createError(404, "Data not found");
  }

  return existingData;
};

const getRoles = async ({ orgSlug }) => {
  const orgData = await getOrgDetails(orgSlug);

  const dataList = await Role.findAll({
    where: {
      deletedAt: null,
      [Op.or]: [
        {
          organizationId: orgData.id,
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
  { orgSlug, roleId },
  { name, description, isSystem },
) => {
  const orgData = await getOrgDetails(orgSlug);

  const existingData = await getRoleDetails({
    id: roleId,
    deletedAt: null,
  });

  const checkDuplicate = await Role.findOne({
    where: {
      name,
      organizationId: orgData?.id,
      id: { [Op.ne]: existingData?.id },
      deletedAt: null,
    },
  });

  if (checkDuplicate) {
    throw createError(409, "Name already exists");
  }

  await Role.update(
    {
      name,
      organizationId: isSystem ? null : existingData?.organizationId,
      description,
      isSystem,
    },
    {
      where: { id: existingData.id },
    },
  );

  return await Role.findByPk(existingData.id);
};

const updateStatusRole = async (roleId) => {
  const existingData = await getRoleDetails({
    id: roleId,
    deletedAt: null,
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

const deleteRole = async (roleId) => {
  const existingData = await getRoleDetails({
    id: roleId,
    deletedAt: null,
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
  getByIdRole,
  getRoles,
  updateRole,
  updateStatusRole,
  deleteRole,
};
