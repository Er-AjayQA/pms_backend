const router = require("express").Router({ mergeParams: true });
const roleController = require("./roles.controller");
const validate = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const { createRoleSchema, updateRoleSchema } = require("./roles.validation");

router.post(
  "/",
  authMiddleware,
  validate(createRoleSchema),
  roleController.createRole,
);
router.get("/", authMiddleware, roleController.getRoles);
router.get("/:slug", authMiddleware, roleController.getBySlugRole);
router.put(
  "/:slug",
  authMiddleware,
  validate(updateRoleSchema),
  roleController.updateRole,
);
router.patch("/:slug", authMiddleware, roleController.updateStatusRole);
router.delete("/:slug", authMiddleware, roleController.deleteRole);

module.exports = router;
