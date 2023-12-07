const { Model, DataTypes } = require("sequelize");
const User = require("./User");
class ComplaintAgainst extends Model {}

ComplaintAgainst.init(
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
    modelName: "ComplaintAgainst",
  }
);

module.exports = ComplaintAgainst;
