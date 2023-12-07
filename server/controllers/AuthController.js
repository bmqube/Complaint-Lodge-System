const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const UserVerification = require("../models/UserVerification");
const moment = require("moment");
const native = require("../helpers/native");
const utils = require("../helpers/utils");
const mailer = require("../helpers/mailer");
const bcrypt = require("bcrypt");
const UserSession = require("../models/UserSession");
const UserResetPassword = require("../models/UserResetPassword");
const saltRounds = 10;
const path = require("path");
const { googleAuth } = require("../config.json");

module.exports = {
  // api for register

  register: async (req, res) => {
    let unique = "Auth::Register";
    const { fullname, nsuId, email, password, userType } = req.body;
    const { scannedNsuId } = req.files;
    let extension = scannedNsuId.name.split(".").pop();

    try {
      let checkIfEmailAlreadyExists = await User.findAll({
        where: {
          email: email,
        },
      });
      if (fullname.length <= 50) {
        if (nsuId.length <= 10) {
          if (email.length <= 50) {
            if (checkIfEmailAlreadyExists.length === 0) {
              let checkIfNsuIdAlreadyExists = await User.findAll({
                where: {
                  nsuId: nsuId,
                },
              });

              if (checkIfNsuIdAlreadyExists.length === 0) {
                let token = utils.makeToken("USER");
                let hashedPassword = await bcrypt.hash(password, saltRounds);
                let newImageName = `${utils.makeToken("IMAGE")}.${extension}`;
                let filePath = path.join(__dirname, "..");
                scannedNsuId.mv(`${filePath}/files/${newImageName}`);
                let actorType =
                  userType === "Faculty" || userType === "Admin"
                    ? "Reviewer"
                    : "Non-Reviewer";

                let dataToSave = {
                  token: token,
                  nsuId: nsuId,
                  fullname: fullname,
                  email: email,
                  authType: "Password",
                  password: hashedPassword,
                  userType: userType,
                  actorType: actorType,
                  scannedNsuId: newImageName,
                };

                let user = User.build(dataToSave);

                let userVerificationToken = utils.makeToken("VERIFY");
                let expiresAt = moment().add(1, "d").toDate();

                let userVerificationData = UserVerification.build({
                  token: userVerificationToken,
                  userToken: user.token,
                  isVerified: "No",
                  expiresAt: expiresAt,
                });

                await mailer.sendVerificationEmail(
                  email,
                  userVerificationToken
                );
                await user.save();
                await userVerificationData.save();

                native.response(req, res, {
                  responseCode: "INSERTION_SUCCESSFUL",
                  message: "Verification Email Sent",
                  data: {},
                  errorLog: {},
                });
              } else {
                native.response(req, res, {
                  responseCode: "TRY_AGAIN",
                  message: "NSU ID Already Registered",
                  data: {},
                  errorLog: {},
                });
              }
            } else {
              native.response(req, res, {
                responseCode: "TRY_AGAIN",
                message: "Email Already Registered",
                data: {},
                errorLog: {},
              });
            }
          } else {
            native.response(req, res, {
              responseCode: "TRY_AGAIN",
              message: "Email cannot be more than 50 characters",
              data: {},
              errorLog: {},
            });
          }
        } else {
          native.response(req, res, {
            responseCode: "TRY_AGAIN",
            message: "Nsu Id cannot be more than 10 characters",
            data: {},
            errorLog: {},
          });
        }
      } else {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Fullname cannot be more than 50 characters",
          data: {},
          errorLog: {},
        });
      }
    } catch (error) {
      native.response(req, res, {
        responseCode: "TRY_AGAIN",
        message: "Something went wrong",
        data: {},
        errorLog: {
          location: unique,
          error: error,
        },
      });
    }
  },
  // api for login

  login: async (req, res) => {
    let unique = "Auth::Login";
    const { email, password, rememberMe } = req.body;

    try {
      let thisUser = await User.findOne({
        where: {
          email: email,
        },
      });

      if (thisUser) {
        if (thisUser.status === "Verified") {
          if (thisUser.authType === "Password") {
            let match = await bcrypt.compare(password, thisUser.password);

            if (match) {
              let userSessionToken = utils.makeToken("UserSession");
              let expiresAt = moment().add(7, "d").toDate();

              if (rememberMe) {
                expiresAt = moment().add(30, "d").toDate();
              }

              let newUserSession = UserSession.build({
                token: userSessionToken,
                userToken: thisUser.token,
                expiresAt: expiresAt,
              });

              await newUserSession.save();
              native.response(req, res, {
                responseCode: "LIST_LOADED",
                message: "Login Successful",
                data: {
                  userToken: thisUser.token,
                  userSessionToken: newUserSession.token,
                  actorType: thisUser.actorType,
                },
                errorLog: {},
              });
            } else {
              native.response(req, res, {
                responseCode: "TRY_AGAIN",
                message: "The password is invalid",
                data: {},
                errorLog: {},
              });
            }
          } else {
            native.response(req, res, {
              responseCode: "TRY_AGAIN",
              message: "Please use Google sign-in",
              data: {},
              errorLog: {},
            });
          }
        } else {
          if (thisUser.status === "Disabled") {
            native.response(req, res, {
              responseCode: "TRY_AGAIN",
              message: "Your account has been disabled",
              data: {},
              errorLog: {},
            });
          } else {
            native.response(req, res, {
              responseCode: "TRY_AGAIN",
              message: "Please verify your email",
              data: {},
              errorLog: {},
            });
          }
        }
      } else {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Email does not exist",
          data: {},
          errorLog: {},
        });
      }
    } catch (error) {
      native.response(req, res, {
        responseCode: "TRY_AGAIN",
        message: "Something went wrong",
        data: {},
        errorLog: {
          location: unique,
          error: error,
        },
      });
    }
  },
  // api for email verification

  emailVerification: async (req, res) => {
    let unique = "Auth::Verify::Email";
    let verificationToken = req.params.verificationToken;

    try {
      let checkIfExists = await UserVerification.findOne({
        where: {
          token: verificationToken,
        },
      });

      if (checkIfExists) {
        let thisUser = await User.findOne({
          where: {
            token: checkIfExists.userToken,
            status: "Not Verified",
          },
        });

        if (
          checkIfExists.isVerified === "No" &&
          thisUser.status === "Not Verified"
        ) {
          let currentDate = new Date();
          if (currentDate <= checkIfExists.expiresAt) {
            thisUser.status = "Verified";
            checkIfExists.isVerified = "Yes";
            await checkIfExists.save();
            await thisUser.save();

            native.response(req, res, {
              responseCode: "INSERTION_SUCCESSFUL",
              message: "Email Successfully Verified",
              data: {},
              errorLog: {},
            });
          } else {
            native.response(req, res, {
              responseCode: "TRY_AGAIN",
              message: "Verification Link Expired",
              data: {},
              errorLog: {},
            });
          }
        } else {
          native.response(req, res, {
            responseCode: "TRY_AGAIN",
            message: "Email Already Verified",
            data: {},
            errorLog: {},
          });
        }
      } else {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Invalid Verification Link",
          data: {},
          errorLog: {},
        });
      }
    } catch (error) {
      native.response(req, res, {
        responseCode: "TRY_AGAIN",
        message: "Something went wrong",
        data: {},
        errorLog: {
          location: unique,
          error: error,
        },
      });
    }
  },

  // api for forget password
  forgetPassword: async (req, res) => {
    let unique = "Auth::Forget::Password";
    let email = req.params.email;

    try {
      let thisUser = await User.findOne({
        where: {
          email: email,
        },
      });

      if (thisUser) {
        let token = utils.makeToken("ResetPass");
        let expiresAt = moment().add(3, "d").toDate();

        let userResetObject = UserResetPassword.build({
          token: token,
          userToken: thisUser.token,
          expiresAt: expiresAt,
          used: "No",
        });

        await mailer.sendPasswordResetEmail(
          thisUser.email,
          userResetObject.token
        );
        await userResetObject.save();

        native.response(req, res, {
          responseCode: "INSERTION_SUCCESSFUL",
          message: "A password reset link has been sent to your email",
          data: {},
          errorLog: {},
        });
      } else {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "The email is not registered",
          data: {},
          errorLog: {},
        });
      }
    } catch (error) {
      native.response(req, res, {
        responseCode: "TRY_AGAIN",
        message: "Something went wrong",
        data: {},
        errorLog: {
          location: unique,
          error: error,
        },
      });
    }
  },

  // api for verifying reset token
  verifyResetToken: async (req, res) => {
    let unique = "Auth::Verify::Token";
    let resetToken = req.params.resetToken;

    try {
      let thisResetObject = await UserResetPassword.findOne({
        where: {
          token: resetToken,
        },
      });

      if (thisResetObject) {
        if (thisResetObject.used === "No") {
          native.response(req, res, {
            responseCode: "LIST_LOADED",
            message: "The verification link is valid",
            data: {},
            errorLog: {},
          });
        } else {
          native.response(req, res, {
            responseCode: "TRY_AGAIN",
            message: "Password was already reset",
            data: {},
            errorLog: {},
          });
        }
      } else {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Invalid Reset Token",
          data: {},
          errorLog: {},
        });
      }
    } catch (error) {
      console.log(error);
      native.response(req, res, {
        responseCode: "TRY_AGAIN",
        message: "Something went wrong",
        data: {},
        errorLog: {
          location: unique,
          error: error,
        },
      });
    }
  },

  // api for reset token for reseting password

  resetPassword: async (req, res) => {
    let unique = "Auth::Reset::Password";
    let resetToken = req.params.resetToken;
    let newPassword = req.body.password;

    try {
      let thisResetObject = await UserResetPassword.findOne({
        where: {
          token: resetToken,
        },
      });

      if (thisResetObject && thisResetObject.used === "No") {
        let thisUser = await User.findOne({
          where: {
            token: thisResetObject.userToken,
          },
        });

        let hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        thisUser.password = hashedPassword;
        thisResetObject.used = "Yes";
        await thisUser.save();
        await thisResetObject.save();

        native.response(req, res, {
          responseCode: "INSERTION_SUCCESSFUL",
          message: "Password has been reset successfully",
          data: {},
          errorLog: {},
        });
      } else {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Password has not been changed",
          data: {},
          errorLog: {},
        });
      }
    } catch (error) {
      console.log(error);
      native.response(req, res, {
        responseCode: "TRY_AGAIN",
        message: "Something went wrong",
        data: {},
        errorLog: {
          location: unique,
          error: error,
        },
      });
    }
  },

  // api for google login
  googleLogin: async (req, res) => {
    let unique = "Auth::Google::Login";
    const client = new OAuth2Client(googleAuth.clientId);
    const tokenId = req.body.tokenId;

    try {
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: googleAuth.clientId,
      });
      const payload = ticket.getPayload();
      const email = payload["email"];

      let thisUser = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!thisUser) {
        native.response(req, res, {
          responseCode: "AUTH_ERROR",
          message: "Email does not exist",
          data: {},
          errorLog: {},
        });
      } else {
        if (thisUser.authType === "Password") {
          native.response(req, res, {
            responseCode: "TRY_AGAIN",
            message: "Please Use Password to Login",
            data: {},
            errorLog: {},
          });
        } else {
          let userSessionToken = utils.makeToken("UserSession");
          let expiresAt = moment().add(7, "d").toDate();

          let newUserSession = UserSession.build({
            token: userSessionToken,
            userToken: thisUser.token,
            expiresAt: expiresAt,
          });

          await newUserSession.save();
          native.response(req, res, {
            responseCode: "LIST_LOADED",
            message: "Login Successful",
            data: {
              userToken: thisUser.token,
              userSessionToken: newUserSession.token,
              actorType: thisUser.actorType,
            },
            errorLog: {},
          });
        }
      }
    } catch (error) {
      native.response(req, res, {
        responseCode: "TRY_AGAIN",
        message: "Something went wrong",
        data: {},
        errorLog: {
          location: unique,
          error: error,
        },
      });
    }
  },

  // api for google register
  googleRegister: async (req, res) => {
    let unique = "Auth::Google::Register";
    const client = new OAuth2Client(googleAuth.clientId);
    let { tokenId, nsuId, userType } = req.body;
    const { scannedNsuId } = req.files;
    let extension = scannedNsuId.name.split(".").pop();

    try {
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: googleAuth.clientId,
      });
      const payload = ticket.getPayload();
      console.log(payload);
      const email = payload["email"];
      let fullname = payload["given_name"] + " " + payload["family_name"];
      if (email.split("@").pop() === "northsouth.edu") {
        nsuId = payload["family_name"];
        fullname = payload["given_name"];
      }

      let token = utils.makeToken("USER");
      let newImageName = `${utils.makeToken("IMAGE")}.${extension}`;
      let filePath = path.join(__dirname, "..");
      scannedNsuId.mv(`${filePath}/files/${newImageName}`);
      let actorType =
        userType === "Faculty" || userType === "Admin"
          ? "Reviewer"
          : "Non-Reviewer";

      let dataToSave = {
        token: token,
        nsuId: nsuId,
        fullname: fullname,
        email: email,
        authType: "Google",
        password: "",
        userType: userType,
        actorType: actorType,
        scannedNsuId: newImageName,
        status: "Verified",
      };

      let user = User.build(dataToSave);
      let userSessionToken = utils.makeToken("UserSession");
      let expiresAt = moment().add(7, "d").toDate();

      let newUserSession = UserSession.build({
        token: userSessionToken,
        userToken: user.token,
        expiresAt: expiresAt,
      });

      await newUserSession.save();
      await user.save();

      native.response(req, res, {
        responseCode: "LIST_LOADED",
        message: "Login Successful",
        data: {
          userToken: user.token,
          userSessionToken: newUserSession.token,
          actorType: user.actorType,
        },
        errorLog: {},
      });
    } catch (error) {
      console.log(error);
      native.response(req, res, {
        responseCode: "TRY_AGAIN",
        message: "Something went wrong",
        data: {},
        errorLog: {
          location: unique,
          error: error,
        },
      });
    }
  },
};
