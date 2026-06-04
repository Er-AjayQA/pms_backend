const { Role } = require("../../database/models");
const createError = require("http-errors");
const generateSlug = require("../../utils/generateSlug");
const { Op } = require("sequelize");

const createRole = async ({ organizationId, name, description, isSystem }) => {
  const slug = generateSlug(name);
  const existingData = await Role.findOne({
    where: { slug, deletedAt: null },
  });

  if (existingData) {
    throw createError(409, "Role slug already exists");
  }

  const data = await Role.create({
    organizationId,
    name,
    slug,
    description,
    isSystem,
  });

  return data;
};

const getBySlugRole = async (slug) => {
  const existingData = await Role.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingData) {
    throw createError(404, "Data not found");
  }

  return existingData;
};

const getRoles = async (slug) => {
  const dataList = await Role.findAll({
    where: { deletedAt: null },
  });

  if (dataList?.length === 0) {
    throw createError(404, "Data not found");
  }

  return dataList;
};

const updateRole = async (
  slug,
  { organizationId, name, description, isSystem, status },
) => {
  const existingData = await Role.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingData) {
    throw createError(409, "Data not found");
  }

  const isNameChange = name && existingData?.name !== name;

  const newSlug = isNameChange ? generateSlug(name) : existingData?.slug;

  if (isNameChange) {
    const checkNewSlug = await Role.findOne({
      where: {
        slug: newSlug,
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
