const { z } = require("zod");

const createPermissionSchema = z.object({
  body: z.object({
    module: z.string(),
    action: z.string(),
    description: z.string().optional(),
  }),
});

module.exports = { createPermissionSchema };
