const { Model, DataTypes } = require("sequelize");
class User extends Model {}

User.init(
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
    },
    nsuId: {
      type: DataTypes.STRING,
      unique: true,
    },
    fullname: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    authType: {
      type: DataTypes.ENUM("Google", "Password"),
    },
    password: {
      // contains password
      type: DataTypes.STRING,
    },
    userType: {
      type: DataTypes.ENUM(
        "Admin",
        "Student",
        "Faculty",
        "TA/RA",
        "Helper",
        "SysAdmin"
      ),
    },
    actorType: {
      type: DataTypes.ENUM("Reviewer", "Non-Reviewer", "SysAdmin"),
    },
    scannedNsuId: {
      type: DataTypes.STRING,
    },
    status: {
      // Verified / Not Verified / Disabled
      type: DataTypes.STRING,
      defaultValue: "Not Verified",
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

module.exports = User;
