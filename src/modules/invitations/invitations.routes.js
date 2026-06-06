const router = require("express").Router({ mergeParams: true });
const invitationController = require("./invitations.controller");
const validate = require("../../middlewares/validate.middleware");
const { createInvitationSchema } = require("./invitations.validation");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post(
  "/",
  authMiddleware,
  validate(createInvitationSchema),
  invitationController.createInvitation,
);

module.exports = router;
