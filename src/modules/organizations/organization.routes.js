const router = require("express").Router();
const organizationController = require("./organization.controller");
const validate = require("../../middlewares/validate.middleware");
const { createOrganizationSchema } = require("./organization.validation");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post(
  "/",
  authMiddleware,
  validate(createOrganizationSchema),
  organizationController.createOrganization,
);
router.get("/", authMiddleware, organizationController.getOrganizations);
router.get(
  "/:slug",
  authMiddleware,
  organizationController.getBySlugOrganization,
);
router.get(
  "/:slug/roles",
  authMiddleware,
  organizationController.getRolesOrganization,
);
router.put("/:slug", authMiddleware, organizationController.updateOrganization);
router.patch(
  "/:slug",
  authMiddleware,
  organizationController.updateStatusOrganization,
);
router.delete(
  "/:slug",
  authMiddleware,
  organizationController.deleteOrganization,
);

module.exports = router;
