const router = require("express").Router();

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const organizationRoutes = require("./modules/organizations/organization.routes");

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SaaS Project Management API v1",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/organizations", organizationRoutes);

module.exports = router;
