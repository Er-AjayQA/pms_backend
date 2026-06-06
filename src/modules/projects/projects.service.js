const { Project, ProjectMember, Role } = require("../../database/models");
const createError = require("http-errors");
const generateSlug = require("../../utils/generateSlug");
const { Op } = require("sequelize");

const getBySlugProject = async (slug) => {
  const existingData = await Project.findOne({
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

  if (!existingData) {
    throw createError(404, "Project not found");
  }

  return existingData;
};

const getProjects = async (slug) => {
  const dataList = await Project.findAll({
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

  if (dataList?.length === 0) {
    throw createError(404, "Projects not found");
  }

  return dataList;
};

const createProject = async (
  userId,
  { name, description, logoUrl, startDate, endDate },
) => {
  const slug = generateSlug(name);

  const alreadyExist = await Project.findOne({
    where: { [Op.or]: [{ slug }, { name }], deletedAt: null },
  });

  if (alreadyExist) {
    throw createError(409, "Project already exists");
  }

  const project = await Project.create({
    name,
    slug,
    description,
    ownerId: userId,
    logoUrl,
    startDate,
    endDate,
  });

  const ownerRole = await Role({ where: { name: "Owner", deletedAt: null } });

  const registerAsMember = await ProjectMember.create({
    projectId: project?.id,
    userId,
    roleId: ownerRole?.id,
    joinedAt: new Date(),
  });

  return project;
};

const updateProject = async (
  slug,
  { name, description, logoUrl, startDate, endDate, status },
) => {
  const existingData = await Project.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingData) {
    throw createError(409, "Project not found");
  }

  const checkName = await Project.findOne({
    where: {
      name,
      id: { [Op.ne]: existingData.id },
    },
  });

  if (checkName) {
    throw createError(409, "Project name already exists");
  }

  await Project.update(
    {
      name,
      description,
      logoUrl,
      startDate,
      endDate,
      status,
    },
    {
      where: { id: existingData.id },
    },
  );

  return await Project.findByPk(existingData.id);
};

const updateStatusProject = async (slug) => {
  const existingData = await Project.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingData) {
    throw createError(409, "Project not found");
  }

  await Project.update(
    {
      status: existingData?.status === "active" ? "inactive" : "active",
    },
    {
      where: { id: existingData.id },
    },
  );

  return await Project.findByPk(existingData.id);
};

const deleteProject = async (slug) => {
  const existingData = await Project.findOne({
    where: { slug, deletedAt: null },
  });

  if (!existingData) {
    throw createError(409, "Project not found");
  }

  await Project.update(
    {
      deletedAt: new Date(),
    },
    {
      where: { id: existingData.id },
    },
  );

  return await Project.findByPk(existingData.id);
};

module.exports = {
  createProject,
  getBySlugProject,
  getProjects,
  updateProject,
  deleteProject,
  updateStatusProject,
};
