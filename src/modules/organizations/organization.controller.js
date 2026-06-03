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

module.exports = {
  createOrganization,
  getBySlugOrganization,
  getOrganizations,
};
