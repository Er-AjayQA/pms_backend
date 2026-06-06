const { z } = require("zod");

const createMemberSchema = z.object({
  body: z.object({
    name: z.string(),
    isSystem: z.boolean(),
    description: z.string().optional(),
  }),
});

const updateMemberSchema = z.object({
  body: z.object({
    name: z.string(),
    isSystem: z.boolean(),
    description: z.string().optional(),
  }),
});

module.exports = { createMemberSchema, updateMemberSchema };
