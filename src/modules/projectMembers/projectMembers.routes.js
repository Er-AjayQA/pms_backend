const router = require("express").Router({ mergeParams: true });
const memberController = require("./projectMembers.controller");
const validate = require("../../middlewares/validate.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const {
  createMemberSchema,
  updateMemberSchema,
} = require("./projectMembers.validation");

router.get("/", authMiddleware, memberController.getMembers);

module.exports = router;
