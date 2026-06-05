const { z } = require("zod");

const createRoleSchema = z.object({
  body: z.object({
    name: z.string(),
    isSystem: z.boolean(),
    description: z.string().optional(),
  }),
});

const updateRoleSchema = z.object({
  body: z.object({
    name: z.string(),
    isSystem: z.boolean(),
    description: z.string().optional(),
  }),
});

module.exports = { createRoleSchema, updateRoleSchema };
