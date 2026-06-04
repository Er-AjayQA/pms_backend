const organizationService = require("./organization.service");

const createOrganization = async (req, res, next) => {
  try {
    const organization = await organizationService.createOrganization(req.body);

    res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: { organization },
    });
  } catch (error) {
    next(error);
  }
};

const getBySlugOrganization = async (req, res, next) => {
  try {
    const organization = await organizationService.getBySlugOrganization(
      req.params.slug,
    );

    res.status(200).json({
      success: true,
      message: "Organization retrieved successfully",
      data: { organization },
    });
  } catch (error) {
    next(error);
  }
};

const getOrganizations = async (req, res, next) => {
  try {
    const organizations = await organizationService.getOrganizations();

    res.status(200).json({
      success: true,
      message: "Organizations retrieved successfully",
      data: { organizations },
    });
  } catch (error) {
    next(error);
  }
};

const updateOrganization = async (req, res, next) => {
  try {
    const organization = await organizationService.updateOrganization(
      req.params.slug,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Organization updated successfully",
      data: { organization },
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrganization = async (req, res, next) => {
  try {
    const organization = await organizationService.deleteOrganization(
      req.params.slug,
    );

    res.status(201).json({
      success: true,
      message: "Organization deleted successfully",
      data: { organization },
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusOrganization = async (req, res, next) => {
  try {
    const organization = await organizationService.updateStatusOrganization(
      req.params.slug,
    );

    res.status(201).json({
      success: true,
      message: "Status changed successfully",
      data: { organization },
    });
  } catch (error) {
    next(error);
  }
};

const getRolesOrganization = async (req, res, next) => {
  try {
    const dataList = await organizationService.getRolesOrganization(
      req.params.slug,
    );

    res.status(200).json({
      success: true,
      message: "Roles retrieved successfully",
      data: { dataList },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrganization,
  getBySlugOrganization,
  getOrganizations,
  updateOrganization,
  deleteOrganization,
  updateStatusOrganization,
  getRolesOrganization,
};
