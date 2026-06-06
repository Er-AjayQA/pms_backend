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

const getInvitations = async (req, res, next) => {
  try {
    const dataList = await invitationService.getInvitations(req.params.orgSlug);

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
};
