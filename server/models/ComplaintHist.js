const { Model, DataTypes } = require("sequelize");
class ComplaintHist extends Model {}

ComplaintHist.init(
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
    modelName: "ComplaintHist",
  }
);

module.exports = ComplaintHist;
