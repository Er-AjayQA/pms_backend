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
router.patch(
  "/:inviteId/resend",
  authMiddleware,
  invitationController.resendInvitation,
);
router.post("/accept/:token", invitationController.acceptInvitation);
router.get("/", authMiddleware, invitationController.getInvitations);
router.get(
  "/:inviteId",
  authMiddleware,
  invitationController.getByIdInvitation,
);
router.patch(
  "/:inviteId/revoke",
  authMiddleware,
  invitationController.revokeInvitation,
);
router.delete(
  "/:inviteId/delete",
  authMiddleware,
  invitationController.deleteInvitation,
);

module.exports = router;
