const router = require("express").Router();
const organizationController = require("./organization.controller");
const validate = require("../../middlewares/validate.middleware");
const { createOrganizationSchema } = require("./organization.validation");
const authMiddleware = require("../../middlewares/auth.middleware");
const rolesRoutes = require("../roles/roles.routes");
const memberRoutes = require("../organizationMembers/organizationMembers.routes");
const invitationRoutes = require("../invitations/invitations.routes");

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

// Other Routes
router.use("/:orgSlug/roles", rolesRoutes);
router.use("/:orgSlug/members", memberRoutes);
router.use("/:orgSlug/invitations", invitationRoutes);

module.exports = router;
