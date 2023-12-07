const User = require("../models/User");
const native = require("../helpers/native");
const UserSession = require("../models/UserSession");

const centralAuth = (v) => {
  return async function (req, res, next) {
    if (v.baseRoute !== "auth") {
      let userToken = req.headers.usertoken;
      let userSessionToken = req.headers.usersessiontoken;

      // console.log(req.headers);

      let thisUser = await User.findOne({
        where: {
          token: userToken,
        },
      });

      let userSession = await UserSession.findOne({
        where: {
          token: userSessionToken,
        },
      });

      if (!thisUser) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Invalid User Token",
          data: {},
          errorLog: {},
        });
        return;
      }

      if (v.baseRoute == "reviewer" && thisUser.actorType != "Reviewer") {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "You are not authorized visit this link",
          data: {},
          errorLog: {},
        });
        return;
      }

      if (v.baseRoute == "admin" && thisUser.actorType != "SysAdmin") {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "You are not authorized visit this link",
          data: {},
          errorLog: {},
        });
        return;
      }

      if (!userSession || userSession.userToken != userToken) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "You are not authorized visit this link",
          data: {},
          errorLog: {},
        });
        return;
      }

      let expiresAt = new Date(userSession.expiresAt);
      let currentDate = new Date();
      if (currentDate > expiresAt) {
        native.response(req, res, {
          responseCode: "SESSION_EXPIRED",
          message: "Your login session has been expired",
          data: {},
          errorLog: {},
        });
        return;
      }
    }
    next();
  };
};

module.exports = centralAuth;
