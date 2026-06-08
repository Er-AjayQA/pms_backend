const router = require("express").Router();

const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const projectRoutes = require("./modules/projects/projects.routes");

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SaaS Project Management API v1",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);

module.exports = router;
