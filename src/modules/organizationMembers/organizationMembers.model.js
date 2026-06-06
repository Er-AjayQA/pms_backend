module.exports = (sequelize, DataTypes) => {
  const OrganizationMember = sequelize.define(
    "OrganizationMember",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "invited", "removed"),
        allowNull: false,
        defaultValue: "active",
      },
      joinedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "Organization_Members",
      paranoid: true,
      timestamps: true,
    },
  );

  return OrganizationMember;
};
