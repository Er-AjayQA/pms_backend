"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("organization_members", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      organizationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "organizations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      status: {
        type: Sequelize.ENUM("active", "invited", "removed"),
        allowNull: false,
        defaultValue: "active",
      },

      joinedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("organization_members", ["organizationId"]);
    await queryInterface.addIndex("organization_members", ["userId"]);
    await queryInterface.addIndex("organization_members", ["roleId"]);

    await queryInterface.addIndex(
      "organization_members",
      ["organizationId", "userId"],
      {
        unique: true,
        name: "unique_organization_member",
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("organization_members");
  },
};
