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
router.get("/:roleId", authMiddleware, roleController.getBySlugRole);
router.put(
  "/:roleId",
  authMiddleware,
  validate(updateRoleSchema),
  roleController.updateRole,
);
router.patch("/:roleId", authMiddleware, roleController.updateStatusRole);
router.delete("/:roleId", authMiddleware, roleController.deleteRole);

module.exports = router;
