const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const env = require("../config/env");
const { User } = require("../database/models");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Access token missing");
    }

    const token = authHeader.split(" ")[1];

    let payload;

    try {
      payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    } catch (error) {
      throw createError(401, "Invalid or expired access token");
    }

    const user = await User.findByPk(payload.sub, {
      attributes: [
        "id",
        "name",
        "email",
        "avatarUrl",
        "status",
        "isEmailVerified",
      ],
    });

    if (!user) {
      throw createError(401, "User not found");
    }

    if (user.status !== "active") {
      throw createError(403, "Account is not active");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
