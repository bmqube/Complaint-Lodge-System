const { Model, DataTypes } = require("sequelize");
class UserSession extends Model {}

UserSession.init(
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    userToken: {
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
    modelName: "UserSession",
  }
);

module.exports = UserSession;
