const { Model, DataTypes } = require("sequelize");
class ComplaintComment extends Model {}

ComplaintComment.init(
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    userToken: {
      type: DataTypes.STRING,
    },
    complaintToken: {
      type: DataTypes.STRING,
    },
    commentType: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
    status: {
      // Active / Disabled
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
  },
  {
    sequelize,
    modelName: "ComplaintComment",
  }
);

module.exports = ComplaintComment;
