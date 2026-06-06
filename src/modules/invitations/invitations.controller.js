const invitationService = require("./invitations.service");

const createInvitation = async (req, res, next) => {
  try {
    const data = await invitationService.createInvitation(
      req.params.slug,
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

const getInvitations = async (req, res, next) => {
  try {
    const dataList = await invitationService.getInvitations(req.params);

    res.status(200).json({
      success: true,
      message: "Invitations retrieved successfully",
      data: dataList,
    });
  } catch (error) {
    next(error);
  }
};

const getByIdInvitation = async (req, res, next) => {
  try {
    const data = await invitationService.getByIdInvitation(req.params);

    res.status(200).json({
      success: true,
      message: "Invitation retrieved successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const acceptInvitation = async (req, res, next) => {
  try {
    const data = await invitationService.acceptInvitation(req.params);

    res.status(201).json({
      success: true,
      message: "Invitation accepted successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const resendInvitation = async (req, res, next) => {
  try {
    const data = await invitationService.resendInvitation(req.params);

    res.status(201).json({
      success: true,
      message: "Invitation resend successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const revokeInvitation = async (req, res, next) => {
  try {
    const data = await invitationService.revokeInvitation(req.params.inviteId);

    res.status(201).json({
      success: true,
      message: "Invitation revoked successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteInvitation = async (req, res, next) => {
  try {
    const data = await invitationService.deleteInvitation(req.params.inviteId);

    res.status(200).json({
      success: true,
      message: "Invitation deleted successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvitation,
  getInvitations,
  getByIdInvitation,
  revokeInvitation,
  deleteInvitation,
  resendInvitation,
  acceptInvitation,
};
