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
const sendMail = require("../../config/mailer");

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
    throw createError(409, "An invitation already exists for this email.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(token);

  const inviteLink = `${env.CLIENT_URL}/invitations/${token}`;

  await sendMail({
    to: email,
    subject: "You have been invited to join an organization",
    html: `
      <p>You have been invited to join the organization.</p>
      <p><a href="${inviteLink}">Accept Invitation</a></p>
    `,
  });

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

const revokeInvitation = async (inviteId) => {
  const existingInvitation = await Invitation.findOne({
    where: {
      id: inviteId,
      deletedAt: null,
    },
  });

  if (!existingInvitation) {
    throw createError(404, "Data not found.");
  }

  await Invitation.update(
    {
      status: "revoked",
    },
    {
      where: {
        id: inviteId,
      },
    },
  );

  const invitation = await Invitation.findByPk(inviteId);

  return invitation;
};

const deleteInvitation = async (inviteId) => {
  const existingInvitation = await Invitation.findOne({
    where: {
      id: inviteId,
      deletedAt: null,
    },
  });

  if (!existingInvitation) {
    throw createError(404, "Data not found.");
  }

  await Invitation.update(
    {
      deletedAt: new Date(),
    },
    {
      where: {
        id: inviteId,
      },
    },
  );

  const invitation = await Invitation.findByPk(inviteId);

  return invitation;
};

module.exports = {
  createInvitation,
  getInvitations,
  getByIdInvitation,
  revokeInvitation,
  deleteInvitation,
};
