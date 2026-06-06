const invitationService = require("./invitations.service");

const createInvitation = async (req, res, next) => {
  try {
    const data = await invitationService.createInvitation(
      req.params.orgSlug,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Invitation created successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvitation,
};
