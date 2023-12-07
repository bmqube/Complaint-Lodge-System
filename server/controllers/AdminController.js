const native = require("../helpers/native");
const User = require("../models/User");
const utils = require("../helpers/utils");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const path = require("path");
const mailer = require("../helpers/mailer");
const moment = require("moment");
const Complaint = require("../models/Complaint");
const ComplaintComment = require("../models/ComplaintComment");
const ComplaintAgainst = require("../models/ComplaintAgainst");
const ComplaintEvidence = require("../models/ComplaintEvidence");

module.exports = {
  //Displaying All Users
  allUsers: async (req, res) => {
    let unique = "Admin::Users";

    try {
      let listOfUser = await User.findAll({
        attributes: {
          exclude: ["password"],
        },
        where: {
          status: "Verified",
        },
      });

      native.response(req, res, {
        responseCode: "LIST_LOADED",
        message: "",
        data: {
          items: listOfUser,
          itemsCount: listOfUser.length,
        },
        errorLog: {},
      });
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

  // for disabling specific user
  disableUsers: async (req, res) => {
    let unique = "Admin::User::Disable";
    let userToken = req.body.userToken;

    try {
      let currentUser = await User.findOne({
        where: {
          token: userToken,
          status: "Verified",
        },
      });

      if (!currentUser) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Invalid User Token",
          data: {},
          errorLog: {},
        });
        return;
      }

      await Complaint.update(
        { status: "Disabled" },
        { where: { userToken: userToken } }
      );

      currentUser.status = "Disabled";
      await currentUser.save();
      native.response(req, res, {
        responseCode: "INSERTION_SUCCESSFUL",
        message: "User Successfully Disabled",
        data: {},
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
  //Adding New User
  addNewUser: async (req, res) => {
    let unique = "Admin::Add::New";
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
                  status: "Verified",
                };

                let user = User.build(dataToSave);
                let expiresAt = moment().add(1, "d").toDate();

                await mailer.sendEmailToAddedUser(email);
                await user.save();

                native.response(req, res, {
                  responseCode: "INSERTION_SUCCESSFUL",
                  message: "User Added Successfully",
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
  //Search Representative
  searchRepresentative: async (req, res) => {
    let unique = "Admin::Search";
    let keyword = req.body.keyword.trim();
    let userToken = req.headers.usertoken;

    try {
      let usersList = await User.findAll({
        attributes: {
          exclude: ["password", "scannedNsuId"],
        },
        where: {
          token: {
            [Op.not]: userToken,
          },
          status: "Verified",
          [Op.or]: [
            {
              fullname: {
                [Op.like]: `%${keyword}%`,
              },
            },
            {
              nsuId: {
                [Op.like]: `${keyword}%`,
              },
            },
            {
              email: {
                [Op.like]: `${keyword}%`,
              },
            },
          ],
          userType: {
            [Op.not]: "SysAdmin",
          },
        },
        limit: 10,
      });

      native.response(req, res, {
        responseCode: "LIST_LOADED",
        message: `Found ${usersList.length} users`,
        data: {
          items: usersList,
          itemsCount: usersList.length,
        },
        errorLog: {},
      });
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
  //Searching users against whom complaint will be lodged
  searchComplainee: async (req, res) => {
    let unique = "Admin::Search";
    let keyword = req.body.keyword.trim();
    let userToken = req.headers.usertoken;

    try {
      let usersList = await User.findAll({
        attributes: {
          exclude: ["password", "scannedNsuId"],
        },
        where: {
          token: {
            [Op.not]: userToken,
          },
          status: "Verified",
          [Op.or]: [
            {
              fullname: {
                [Op.like]: `%${keyword}%`,
              },
            },
            {
              nsuId: {
                [Op.like]: `${keyword}%`,
              },
            },
            {
              email: {
                [Op.like]: `${keyword}%`,
              },
            },
          ],
          userType: {
            [Op.not]: "SysAdmin",
          },
        },
        limit: 10,
      });

      native.response(req, res, {
        responseCode: "LIST_LOADED",
        message: `Found ${usersList.length} users`,
        data: {
          items: usersList,
          itemsCount: usersList.length,
        },
        errorLog: {},
      });
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

  //search reviewer
  searchReviewer: async (req, res) => {
    let unique = "Admin::Search";
    let keyword = req.body.keyword.trim();
    let userToken = req.headers.usertoken;

    // console.log(userToken);

    try {
      let usersList = await User.findAll({
        attributes: {
          exclude: ["password", "scannedNsuId"],
        },
        where: {
          token: {
            [Op.not]: userToken,
          },
          status: "Verified",
          [Op.or]: [
            {
              fullname: {
                [Op.like]: `%${keyword}%`,
              },
            },
            {
              nsuId: {
                [Op.like]: `${keyword}%`,
              },
            },
            {
              email: {
                [Op.like]: `${keyword}%`,
              },
            },
          ],
          actorType: "Reviewer",
        },
        limit: 10,
      });

      native.response(req, res, {
        responseCode: "LIST_LOADED",
        message: `Found ${usersList.length} users`,
        data: {
          items: usersList,
          itemsCount: usersList.length,
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

  //Lodge new Complaint on behalf of a user
  lodgeNewComplaint: async (req, res) => {
    let unique = "Admin::New";
    let representative = JSON.parse(req.body.representative);
    let complaintAgainstList = JSON.parse(req.body.complaintAgainstList);
    let userToken = req.headers.usertoken;
    let message = req.body.message;
    let evidence = req.files.evidence;
    let reviewer = JSON.parse(req.body.reviewer);
    let filePath = path.join(__dirname, "..");

    try {
      if (!representative) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Representative list can't be empty",
          data: {},
          errorLog: {},
        });
        return;
      }
      if (!complaintAgainstList) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Complaint against list can't be empty",
          data: {},
          errorLog: {},
        });
        return;
      }

      if (!message) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Message can't be empty",
          data: {},
          errorLog: {},
        });
        return;
      }

      if (!evidence || evidence.length === 0) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Please provide some evidence",
          data: {},
          errorLog: {},
        });
        return;
      }

      if (!reviewer) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Please choose a reviewer",
          data: {},
          errorLog: {},
        });
        return;
      }

      let token = utils.makeToken("Complaint");
      let complaint = await Complaint.create({
        token: token,
        userToken: representative.token,
        reviewerToken: reviewer.token,
        description: message,
      });

      for (let i = 0; i < complaintAgainstList.length; i++) {
        const curr_elem = complaintAgainstList[i].token;
        let curr_token = utils.makeToken("CompaintAgainst");
        // console.log(curr_elem);
        await ComplaintAgainst.create({
          token: curr_token,
          complaintToken: token,
          complaintAgainstToken: curr_elem,
        });
      }

      if (Array.isArray(evidence)) {
        for (let i = 0; i < evidence.length; i++) {
          let curr_file = evidence[i];
          let curr_token = utils.makeToken("ComplaintEvidence");
          let extension = curr_file.name.split(".").pop();
          let newFileName = `${utils.makeToken("EVIDENCE")}.${extension}`;
          curr_file.mv(`${filePath}/files/${newFileName}`);
          await ComplaintEvidence.create({
            token: curr_token,
            complaintToken: token,
            fileName: newFileName,
            originalFileName: curr_file.name,
          });
        }
      } else {
        let curr_file = evidence;
        let curr_token = utils.makeToken("ComplaintEvidence");
        let extension = curr_file.name.split(".").pop();
        let newFileName = `${utils.makeToken("EVIDENCE")}.${extension}`;
        curr_file.mv(`${filePath}/files/${newFileName}`);
        await ComplaintEvidence.create({
          token: curr_token,
          complaintToken: token,
          fileName: newFileName,
          originalFileName: curr_file.name,
        });
      }

      native.response(req, res, {
        responseCode: "INSERTION_SUCCESSFUL",
        message: "Complaint Successfully Lodged",
        data: {},
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
