const {
  User,
  Project,
  ProjectMember,
  Role,
  Invitation,
} = require("../../database/models");
const createError = require("http-errors");
const { Op } = require("sequelize");
const crypto = require("crypto");
const env = require("../../config/env");
const { hashToken, getOrgDetails } = require("../../utils/helpers");
const sendMail = require("../../config/mailer");
const projectService = require("../projects/projects.service");

// Helper Function
const checkExpiry = (expiryDate) => {
  const currentDate = new Date();
  return currentDate > expiryDate;
};

// Service Functions
const getInvitations = async ({ slug }) => {
  const existingProject = await projectService.getBySlugProject(slug);

  const dataList = await Invitation.findAll({
    where: {
      projectId: existingProject.id,
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

const getByIdInvitation = async ({ slug, inviteId }) => {
  const existingProject = await projectService.getBySlugProject(slug);

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

const createInvitation = async (slug, { email, roleId }) => {
  const existingProject = await projectService.getBySlugProject(slug);

  const existingInvitation = await Invitation.findOne({
    where: {
      email,
      projectId: existingProject?.id,
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
    subject: "You have been invited to join the project",
    html: `
      <p>You have been invited to join the project.</p>
      <p><a href="${inviteLink}">Accept Invitation</a></p>
    `,
  });

  const invitation = await Invitation.create({
    projectId: existingProject.id,
    roleId,
    email,
    tokenHash: hashedToken,
    expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return invitation;
};

const resendInvitation = async ({ slug, inviteId }) => {
  const existingProject = await projectService.getBySlugProject(slug);

  const invitation = await Invitation.findByPk(inviteId, {
    where: {
      deletedAt: null,
    },
  });

  if (!invitation) {
    throw createError(404, "Invitation not found.");
  }

  if (invitation.status !== "pending") {
    throw createError(400, "Only pending invitations can be resent.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(token);
  const inviteLink = `${env.CLIENT_URL}/invitations/${token}`;

  await invitation.update({
    tokenHash: hashedToken,
    expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  await sendMail({
    to: invitation.email,
    subject: "You have been invited to join the project",
    html: `
      <p>You have been invited to join the project.</p>
      <p><a href="${inviteLink}">Accept Invitation</a></p>
    `,
  });

  return invitation;
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

const acceptInvitation = async ({ slug, token }) => {
  const existingProject = await projectService.getBySlugProject(slug);
  const tokenHash = hashToken(token);
  let data = null;

  const existingInvitation = await Invitation.findOne({
    where: {
      tokenHash,
      projectId: existingProject?.id,
      deletedAt: null,
      status: { [Op.in]: ["pending"] },
    },
  });

  if (!existingInvitation) {
    throw createError(404, "Invitation not found.");
  }

  if (checkExpiry(existingInvitation.expiredAt)) {
    throw createError(400, "Invitation has expired.");
  }

  const userExist = await User.findOne({
    where: { email: existingInvitation.email, deletedAt: null },
  });

  if (!userExist) {
    data = { requiresSignup: true, email: existingInvitation.email };
    return data;
  }

  if (userExist.email !== existingInvitation.email) {
    throw createError(403, "This invitation is not for your account.");
  }

  data = await ProjectMember.create({
    projectId: existingInvitation.projectId,
    userId: userExist.id,
    roleId: existingInvitation.roleId,
  });

  await Invitation.update(
    { status: "accepted" },
    {
      where: {
        id: existingInvitation.id,
      },
    },
  );

  return { requiresSignup: false, ...data };
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
