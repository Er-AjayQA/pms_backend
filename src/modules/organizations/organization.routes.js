const router = require("express").Router();
const organizationController = require("./organization.controller");
const validate = require("../../middlewares/validate.middleware");
const { createOrganizationSchema } = require("./organization.validation");

router.post(
  "/create",
  validate(createOrganizationSchema),
  organizationController.createOrganization,
);

module.exports = router;
