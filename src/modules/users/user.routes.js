const router = require("express").Router();

const authMiddleware = require("../../middlewares/auth.middleware");
const userController = require("./user.controller");

router.get("/me", authMiddleware, userController.getMe);

module.exports = router;
