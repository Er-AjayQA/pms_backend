const roleService = require("./roles.service");

const createRole = async (req, res, next) => {
  try {
    const data = await roleService.createRole(req.body);

    res.status(201).json({
      success: true,
      message: "Data created successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

const getBySlugRole = async (req, res, next) => {
  try {
    const data = await roleService.getBySlugRole(req.params.slug);

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

const getRoles = async (req, res, next) => {
  try {
    const dataList = await roleService.getRoles();

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: { dataList },
    });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const data = await roleService.updateRole(req.params.slug, req.body);

    res.status(201).json({
      success: true,
      message: "Data updated successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusRole = async (req, res, next) => {
  try {
    const data = await roleService.updateStatusRole(req.params.slug);

    res.status(201).json({
      success: true,
      message: "Status changed successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const data = await roleService.deleteRole(req.params.slug);

    res.status(201).json({
      success: true,
      message: "Data deleted successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRole,
  getBySlugRole,
  getRoles,
  updateRole,
  updateStatusRole,
  deleteRole,
};
