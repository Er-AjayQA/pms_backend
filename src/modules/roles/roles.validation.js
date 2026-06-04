const { z } = require("zod");

const createRoleSchema = z.object({
  body: z.object({
    organizationId: z.string().optional(),
    name: z.string(),
    isSystem: z.boolean(),
    description: z.string().optional(),
  }),
});

const updateRoleSchema = z.object({
  body: z.object({
    organizationId: z.string().optional(),
    name: z.string(),
    isSystem: z.boolean(),
    description: z.string().optional(),
    status: z.string(),
  }),
});

module.exports = { createRoleSchema, updateRoleSchema };
