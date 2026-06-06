const projectService = require("./projects.service");
const roleService = require("../roles/roles.service");

const createProject = async (req, res, next) => {
  try {
    const data = await projectService.createProject(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getBySlugProject = async (req, res, next) => {
  try {
    const data = await projectService.getBySlugProject(req.params.slug);

    res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const dataList = await projectService.getProjects();

    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: dataList,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const data = await projectService.updateProject(req.params.slug, req.body);

    res.status(201).json({
      success: true,
      message: "Project updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusProject = async (req, res, next) => {
  try {
    const data = await projectService.updateStatusProject(req.params.slug);

    res.status(201).json({
      success: true,
      message: "Status changed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const data = await projectService.deleteProject(req.params.slug);

    res.status(201).json({
      success: true,
      message: "Project deleted successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getBySlugProject,
  getProjects,
  updateProject,
  deleteProject,
  updateStatusProject,
};
