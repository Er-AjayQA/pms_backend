const router = require("express").Router();
const organizationController = require("./organization.controller");
const validate = require("../../middlewares/validate.middleware");
const { createOrganizationSchema } = require("./organization.validation");

router.post(
  "/create",
  validate(createOrganizationSchema),
  organizationController.createOrganization,
);
router.get("/:slug", organizationController.getBySlugOrganization);
router.get("/", organizationController.getOrganizations);

module.exports = router;
