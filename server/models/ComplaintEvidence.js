const { Model, DataTypes } = require("sequelize");
class ComplaintEvidence extends Model {}

ComplaintEvidence.init(
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    complaintToken: {
      type: DataTypes.STRING,
    },
    fileName: {
      type: DataTypes.STRING,
    },
    originalFileName: {
      type: DataTypes.STRING,
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
    modelName: "ComplaintEvidence",
  }
);

module.exports = ComplaintEvidence;
