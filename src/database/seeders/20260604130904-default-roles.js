"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Roles", [
      {
        id: uuidv4(),
        name: "Owner",
        slug: "owner",
        description: "This represents the owner of the organization.",
        isSystem: true,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Admin",
        slug: "admin",
        description: "",
        isSystem: true,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Member",
        slug: "member",
        description: "",
        isSystem: true,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Viewer",
        slug: "viewer",
        description: "",
        isSystem: true,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Roles", {
      name: ["Owner", "Admin", "Member", "Viewer"],
    });
  },
};
