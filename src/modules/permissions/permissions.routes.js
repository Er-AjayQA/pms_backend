const router = require("express").Router();
const permissionController = require("./permissions.controller");
const validate = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const { createPermissionSchema } = require("./permissions.validation");

router.post(
  "/",
  authMiddleware,
  validate(createPermissionSchema),
  permissionController.createPermission,
);
router.get("/", authMiddleware, permissionController.getPermissions);
router.get("/:slug", authMiddleware, permissionController.getBySlugPermission);
router.put("/:slug", authMiddleware, permissionController.updatePermission);
router.patch(
  "/:slug",
  authMiddleware,
  permissionController.updateStatusPermission,
);
router.delete("/:slug", authMiddleware, permissionController.deletePermission);

module.exports = router;
