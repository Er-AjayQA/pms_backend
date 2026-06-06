const router = require("express").Router();
const projectController = require("./projects.controller");
const validate = require("../../middlewares/validate.middleware");
const { createProjectSchema } = require("./projects.validation");
const authMiddleware = require("../../middlewares/auth.middleware");
const rolesRoutes = require("../roles/roles.routes");
const memberRoutes = require("../projectMembers/projectMembers.routes");
const invitationRoutes = require("../invitations/invitations.routes");

// Project Routes
router.post(
  "/",
  authMiddleware,
  validate(createProjectSchema),
  projectController.createProject,
);
router.get("/", authMiddleware, projectController.getProjects);
router.get("/:slug", authMiddleware, projectController.getBySlugProject);
router.put("/:slug", authMiddleware, projectController.updateProject);
router.patch("/:slug", authMiddleware, projectController.updateStatusProject);
router.delete("/:slug", authMiddleware, projectController.deleteProject);

// Other Routes
router.use("/:slug/roles", rolesRoutes);
router.use("/:slug/members", memberRoutes);
router.use("/:slug/invitations", invitationRoutes);

module.exports = router;
