const permissionService = require("./permissions.service");

const createPermission = async (req, res, next) => {
  try {
    const data = await permissionService.createPermission(req.body);

    res.status(201).json({
      success: true,
      message: "Data created successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

const getBySlugPermission = async (req, res, next) => {
  try {
    const data = await permissionService.getBySlugPermission(req.params.slug);

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

const getPermissions = async (req, res, next) => {
  try {
    const dataList = await permissionService.getPermissions();

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: { dataList },
    });
  } catch (error) {
    next(error);
  }
};

const updatePermission = async (req, res, next) => {
  try {
    const data = await permissionService.updatePermission(
      req.params.slug,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Data updated successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusPermission = async (req, res, next) => {
  try {
    const data = await permissionService.updateStatusPermission(
      req.params.slug,
    );

    res.status(201).json({
      success: true,
      message: "Status changed successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

const deletePermission = async (req, res, next) => {
  try {
    const data = await permissionService.deletePermission(req.params.slug);

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
  createPermission,
  getBySlugPermission,
  getPermissions,
  updatePermission,
  updateStatusPermission,
  deletePermission,
};
