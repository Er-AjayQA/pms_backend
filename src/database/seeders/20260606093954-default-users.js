"use strict";

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    let passwordHash = await bcrypt.hash("superadmin123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        id: uuidv4(),
        name: "Super Admin",
        email: "superadmin@gmail.com",
        passwordHash: passwordHash,
        avatarUrl: null,
        isEmailVerified: true,
        status: "active",
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", {
      email: ["superadmin@gmail.com"],
    });
  },
};
