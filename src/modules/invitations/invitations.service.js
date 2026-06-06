const {
  Organization,
  OrganizationMember,
  Invitation,
} = require("../../database/models");
const createError = require("http-errors");
const generateSlug = require("../../utils/generateSlug");
const { Op } = require("sequelize");
const { getRoleDetails } = require("../../utils/helpers");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const env = require("../../config/env");
const { hashToken, getOrgDetails } = require("../../utils/helpers");

const createInvitation = async (orgSlug, { email, roleId }) => {
  const existingOrg = await getOrgDetails(orgSlug);

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(token);

  const invitation = await Invitation.create({
    organizationId: existingOrg.id,
    roleId,
    email,
    tokenHash: hashedToken,
    expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return invitation;
};

module.exports = {
  createInvitation,
};
