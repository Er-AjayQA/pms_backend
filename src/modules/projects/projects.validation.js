const { z } = require("zod");

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(250),
    description: z.string().min(2).max(300),
    startDate: z.string(),
    endDate: z.string(),
  }),
});

module.exports = { createProjectSchema };
