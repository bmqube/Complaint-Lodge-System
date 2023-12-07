const { Model, DataTypes } = require("sequelize");
const User = require("./User");
class ComplaintAgainstHist extends Model {}

ComplaintAgainstHist.init(
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    complaintToken: {
      type: DataTypes.STRING,
    },
    complaintAgainstToken: {
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
    modelName: "ComplaintAgainstHist",
  }
);

module.exports = ComplaintAgainstHist;
