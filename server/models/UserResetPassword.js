const { Model, DataTypes } = require("sequelize");
class UserResetPassword extends Model {}

UserResetPassword.init(
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    userToken: {
      type: DataTypes.STRING,
    },
    used: {
      type: DataTypes.STRING,
      defaultValue: "No",
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
    modelName: "UserResetPassword",
  }
);

module.exports = UserResetPassword;
