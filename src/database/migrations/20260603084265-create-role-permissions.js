"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("role_permissions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      permissionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "permissions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("role_permissions", ["roleId"]);
    await queryInterface.addIndex("role_permissions", ["permissionId"]);

    await queryInterface.addIndex(
      "role_permissions",
      ["roleId", "permissionId"],
      {
        unique: true,
        name: "unique_role_permission",
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("role_permissions");
  },
};
