const {
  Organization,
  OrganizationMember,
  Role,
  Invitation,
} = require("../../database/models");
const createError = require("http-errors");
const { Op } = require("sequelize");
const crypto = require("crypto");
const env = require("../../config/env");
const { hashToken, getOrgDetails } = require("../../utils/helpers");

const createInvitation = async (orgSlug, { email, roleId }) => {
  const existingOrg = await getOrgDetails(orgSlug);

  const existingInvitation = await Invitation.findOne({
    where: {
      email,
      organizationId: existingOrg?.id,
      deletedAt: null,
      status: { [Op.in]: ["pending", "accepted"] },
    },
  });

  if (existingInvitation) {
    throw createError.Conflict("An invitation already exists for this email.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(token);

  const inviteLink = `${env.CLIENT_URL}/invitations/${token}`;

  const invitation = await Invitation.create({
    organizationId: existingOrg.id,
    roleId,
    email,
    tokenHash: hashedToken,
    expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return invitation;
};

const getInvitations = async (orgSlug) => {
  const existingOrg = await getOrgDetails(orgSlug);

  const dataList = await Invitation.findAll({
    where: {
      organizationId: existingOrg.id,
      deletedAt: null,
    },
    include: [
      {
        model: Role,
        as: "role",
      },
    ],
  });

  return dataList;
};

const getByIdInvitation = async ({ orgSlug, inviteId }) => {
  const existingOrg = await getOrgDetails(orgSlug);

  const dataList = await Invitation.findByPk(inviteId, {
    include: [
      {
        model: Role,
        as: "role",
      },
    ],
  });

  return dataList;
};

module.exports = {
  createInvitation,
  getInvitations,
  getByIdInvitation,
};
