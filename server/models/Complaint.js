const { Model, DataTypes } = require("sequelize");
class Complaint extends Model {}

Complaint.init(
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userToken: {
      type: DataTypes.STRING,
    },
    reviewerToken: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING(1024),
    },
    status: {
      // Active / Resolved / Disabled
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
    version: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "Complaint",
  }
);

module.exports = Complaint;
