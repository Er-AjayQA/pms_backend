const { z } = require("zod");

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(250),
    description: z.string().min(2).max(300),
    logoUrl: z.string().url().optional(),
    startDate: z.date(),
    endDate: z.date(),
  }),
});

module.exports = { createProjectSchema };
