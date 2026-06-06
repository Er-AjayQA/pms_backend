const { z } = require("zod");

const createRoleSchema = z.object({
  body: z.object({
    name: z.string(),
    status: z.enum("active", "inactive"),
    description: z.string().optional(),
  }),
});

const updateRoleSchema = z.object({
  body: z.object({
    name: z.string(),
    status: z.enum("active", "inactive"),
    description: z.string().optional(),
  }),
});

module.exports = { createRoleSchema, updateRoleSchema };
