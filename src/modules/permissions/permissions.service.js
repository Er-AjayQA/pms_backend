const { Permission } = require("../../database/models");
const createError = require("http-errors");
const generateSlug = require("../../utils/generateSlug");
const { Op } = require("sequelize");

const createPermission = async ({ key, description }) => {
  const slug = generateSlug(key);
  const existingData = await Permission.findOne({
    where: { slug, deletedAt: null },
  });

  if (existingData) {
    throw createError(409, "Permission slug already exists");
  }

  const data = await Permission.create({
    key,
    slug,
    description,
  });

  return data;
};

const getBySlugPermission = async (slug) => {
  const existingData = await Permission.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingData) {
    throw createError(404, "Data not found");
  }

  return existingData;
};

const getPermissions = async (slug) => {
  const dataList = await Permission.findAll({
    where: { deletedAt: null },
  });

  if (dataList?.length === 0) {
    throw createError(404, "Data not found");
  }

  return dataList;
};

const updatePermission = async (slug, { key, description }) => {
  const existingData = await Permission.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingData) {
    throw createError(409, "Data not found");
  }

  const isKeyChange = key && existingData.key !== key;

  const newSlug = isKeyChange ? generateSlug(key) : existingData.slug;

  if (isKeyChange) {
    const checkNewSlug = await Permission.findOne({
      where: {
        slug: newSlug,
        id: { [Op.ne]: existingData.id },
      },
    });

    if (checkNewSlug) {
      throw createError(409, "Key already exists");
    }
  }

  await Permission.update(
    {
      key,
      slug: newSlug,
      description,
    },
    {
      where: { id: existingData.id },
    },
  );

  return await Permission.findByPk(existingData.id);
};

const updateStatusPermission = async (slug) => {
  const existingData = await Permission.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingData) {
    throw createError(409, "Permission not found");
  }

  await Permission.update(
    {
      status: existingData?.status === "active" ? "inactive" : "active",
    },
    {
      where: { id: existingData.id },
    },
  );

  return await Permission.findByPk(existingData.id);
};

const deletePermission = async (slug) => {
  const existingData = await Permission.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingData) {
    throw createError(409, "Data not found");
  }

  await Permission.update(
    {
      deletedAt: new Date(),
    },
    {
      where: { id: existingData.id },
    },
  );

  return await Permission.findByPk(existingData.id);
};

module.exports = {
  createPermission,
  getBySlugPermission,
  getPermissions,
  updatePermission,
  updateStatusPermission,
  deletePermission,
};
