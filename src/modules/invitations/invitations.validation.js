const { z } = require("zod");

const createInvitationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    roleId: z.string(),
  }),
});

module.exports = { createInvitationSchema };
