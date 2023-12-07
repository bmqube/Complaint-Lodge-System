const { Model, DataTypes } = require("sequelize");
class ComplaintEvidenceHist extends Model {}

ComplaintEvidenceHist.init(
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
    modelName: "ComplaintEvidenceHist",
  }
);

module.exports = ComplaintEvidenceHist;
