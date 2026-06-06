const { User, Project, Role, ProjectMember } = require("../../database/models");
const createError = require("http-errors");
const { Op, where } = require("sequelize");
const projectService = require("../projects/projects.service");

// SERVICES
const getMembers = async ({ slug }) => {
  const projData = await projectService.getBySlugProject(slug);

  const dataList = await ProjectMember.findAll({
    where: {
      projectId: projData?.id,
      deletedAt: null,
    },
  });

  if (dataList?.length === 0) {
    throw createError(404, "Members not found");
  }

  return dataList;
};

module.exports = {
  getMembers,
};
