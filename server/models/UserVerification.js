const { Model, DataTypes } = require("sequelize");
class UserVerification extends Model {}

UserVerification.init(
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    userToken: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.STRING,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Active",
    },
  },
  {
    sequelize,
    modelName: "UserVerification",
  }
);

module.exports = UserVerification;
