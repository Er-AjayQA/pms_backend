const router = require("express").Router();

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const organizationRoutes = require("./modules/organizations/organization.routes");
const permissionRoutes = require("./modules/permissions/permissions.routes");

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SaaS Project Management API v1",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/organizations", organizationRoutes);
router.use("/permissions", permissionRoutes);

module.exports = router;
