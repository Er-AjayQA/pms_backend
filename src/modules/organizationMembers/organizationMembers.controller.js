const memberService = require("./organizationMembers.service");

const createRole = async (req, res, next) => {
  try {
    const data = await roleService.createRole(req.params.orgSlug, req.body);

    res.status(201).json({
      success: true,
      message: "Data created successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const getByIdRole = async (req, res, next) => {
  try {
    const data = await roleService.getByIdRole(req.params.roleId);

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

const getMembers = async (req, res, next) => {
  try {
    const dataList = await memberService.getMembers(req.params);

    res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: dataList,
    });
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    const data = await roleService.updateRole(req.params, req.body);

    res.status(201).json({
      success: true,
      message: "Data updated successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusRole = async (req, res, next) => {
  try {
    const data = await roleService.updateStatusRole(req.params.roleId);

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
    const data = await roleService.deleteRole(req.params.roleId);

    res.status(201).json({
      success: true,
      message: "Data deleted successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMembers };
