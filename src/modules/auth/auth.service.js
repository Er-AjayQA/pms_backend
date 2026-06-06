const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const createError = require("http-errors");
const { hashToken } = require("../../utils/helpers");

const env = require("../../config/env");
const { User, RefreshToken, sequelize } = require("../../database/models");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      type: "refresh",
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
  );
};

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw createError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw createError(401, "Invalid email or password");
  }

  if (user.status !== "active") {
    throw createError(403, "Account is not active");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw createError(401, "Invalid email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const tokenHash = hashToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await sequelize.transaction(async (transaction) => {
    await RefreshToken.create(
      {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
      { transaction },
    );

    await user.update(
      {
        lastLoginAt: new Date(),
      },
      { transaction },
    );
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token) => {
  if (!token) {
    throw createError(401, "Refresh token missing");
  }

  let payload;

  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw createError(401, "Invalid or expired refresh token");
  }

  if (payload.type !== "refresh") {
    throw createError(401, "Invalid token type");
  }

  const tokenHash = hashToken(token);

  const storedToken = await RefreshToken.findOne({
    where: {
      tokenHash,
      revokedAt: null,
    },
  });

  if (!storedToken) {
    throw createError(401, "Refresh token revoked or not found");
  }

  if (storedToken.expiresAt < new Date()) {
    throw createError(401, "Refresh token expired");
  }

  const user = await User.findByPk(payload.sub);

  if (!user || user.status !== "active") {
    throw createError(401, "User not found or inactive");
  }

  const newAccessToken = generateAccessToken(user);

  return {
    accessToken: newAccessToken,
  };
};

const logout = async (token) => {
  if (!token) return;

  const tokenHash = hashToken(token);

  await RefreshToken.update(
    {
      revokedAt: new Date(),
    },
    {
      where: {
        tokenHash,
        revokedAt: null,
      },
    },
  );
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
