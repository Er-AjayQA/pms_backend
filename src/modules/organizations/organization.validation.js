const { z } = require("zod");

const createOrganizationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(250),
    ownerId: z.string().uuid(),
    logoUrl: z.string().url().optional(),
  }),
});

module.exports = { createOrganizationSchema };
