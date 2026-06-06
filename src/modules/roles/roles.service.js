const { Project, Role } = require("../../database/models");
const createError = require("http-errors");
const generateSlug = require("../../utils/generateSlug");
const { Op, where } = require("sequelize");
const { getProjectDetails, getRoleDetails } = require("../../utils/helpers");
const projectService = require("../projects/projects.service");

const getByIdRole = async (roleId) => {
  const existingData = await Role({ where: { id: roleId, deletedAt: null } });

  if (!existingData) {
    throw createError(404, "Role not found");
  }

  return existingData;
};

const getRoles = async ({ slug }) => {
  const projData = await getProjectDetails(slug);

  const dataList = await Role.findAll({
    where: {
      deletedAt: null,
    },
  });

  if (dataList?.length === 0) {
    throw createError(404, "Roles not found");
  }

  return dataList;
};

const createRole = async (slug, { name, description }) => {
  const projData = await projectService.getBySlugProject(slug);

  const existingData = await Role.findOne({
    where: {
      name,
      deletedAt: null,
    },
  });

  if (existingData) {
    throw createError(409, "Role name already exists");
  }

  const data = await Role.create({
    name,
    description,
  });

  return data;
};

const updateRole = async ({ slug, roleId }, { name, description, status }) => {
  const projData = await projectService.getBySlugProject(slug);

  const existingData = await getByIdRole(roleId);

  const checkDuplicate = await Role.findOne({
    where: {
      name,
      id: { [Op.ne]: existingData?.id },
      deletedAt: null,
    },
  });

  if (checkDuplicate) {
    throw createError(409, "Role Name already exists");
  }

  await Role.update(
    {
      name,
      description,
      status,
    },
    {
      where: { id: existingData.id },
    },
  );

  return await Role.findByPk(existingData.id);
};

const updateStatusRole = async (roleId) => {
  const existingData = await getByIdRole(roleId);

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
  const existingData = await getByIdRole(roleId);

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
