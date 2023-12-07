const User = require("../models/User");
const Complaint = require("../models/Complaint");
const ComplaintComment = require("../models/ComplaintComment");
const ComplaintAgainst = require("../models/ComplaintAgainst");
const ComplaintEvidence = require("../models/ComplaintEvidence");
const { Op } = require("sequelize");
const native = require("../helpers/native");
const utils = require("../helpers/utils");
const path = require("path");
const ComplaintHist = require("../models/ComplaintHist");
const ComplaintAgainstHist = require("../models/ComplaintAgainstHist");
const ComplaintEvidenceHist = require("../models/ComplaintEvidenceHist");

module.exports = {
  // api for searching user for complaint

  searchUser: async (req, res) => {
    let unique = "Complaint::Search";
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
  // api for searching reviewer for complaint

  searchReviewer: async (req, res) => {
    let unique = "Complaint::Search";
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
  // api for lodging new complaint

  newComplaint: async (req, res) => {
    let unique = "Complaint::New";
    let complaintAgainstList = JSON.parse(req.body.complaintAgainstList);
    let userToken = req.headers.usertoken;
    let message = req.body.message;
    let evidence = req.files.evidence;
    let reviewer = JSON.parse(req.body.reviewer);
    let filePath = path.join(__dirname, "..");

    try {
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
        userToken: userToken,
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
  // api for lodging new complaint

  newAppComplaint: async (req, res) => {
    let unique = "Complaint::App::New";
    let complaintAgainstListTemp = req.body.complaintAgainstList;
    let userToken = req.headers.usertoken;
    let message = req.body.message;
    let evidence = req.files.evidence;
    let reviewer = req.body.reviewer;
    let filePath = path.join(__dirname, "..");

    try {
      if (!complaintAgainstListTemp) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Complaint against list can't be empty",
          data: {},
          errorLog: {},
        });
        return;
      }

      let complaintAgainstList = [];
      if (Array.isArray(complaintAgainstListTemp)) {
        for (let i = 0; i < complaintAgainstListTemp.length; i++) {
          const currTempComplainee = complaintAgainstListTemp[i];
          let nsuId = currTempComplainee.split(" ").pop().slice(1, -1);
          // console.log(`hello: ${nsuId}`);

          let currComplainee = await User.findOne({
            where: {
              nsuId: nsuId,
            },
          });

          if (currComplainee) {
            complaintAgainstList.push(currComplainee);
          }
        }
      } else {
        let nsuId = complaintAgainstListTemp.split(" ").pop().slice(1, -1);
        let currComplainee = await User.findOne({
          where: {
            nsuId: nsuId,
          },
        });

        if (currComplainee) {
          complaintAgainstList.push(currComplainee);
        }
      }

      if (complaintAgainstList.length === 0) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Invalid Complainee",
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

      let nsuId = reviewer.split(" ").pop().slice(1, -1);

      let currReviewer = await User.findOne({
        where: {
          nsuId: nsuId,
        },
      });

      let token = utils.makeToken("Complaint");
      let complaint = await Complaint.create({
        token: token,
        userToken: userToken,
        reviewerToken: currReviewer.token,
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

  // api for complaint details

  complaintDetails: async (req, res) => {
    let unique = "Complaint::Details";
    let complaintToken = req.params.complaintToken;

    try {
      let complaint = await Complaint.findOne({
        attributes: {
          exclude: ["userToken", "reviewerToken"],
        },
        where: {
          token: complaintToken,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: {
              exclude: ["password", "scannedNsuId"],
            },
          },
          {
            model: User,
            as: "reviewer",
            attributes: {
              exclude: ["password", "scannedNsuId"],
            },
          },
          {
            model: ComplaintAgainst,
            attributes: {
              exclude: ["complaintToken", "complaintAgainstToken"],
            },
            include: {
              model: User,
              as: "complaintAgainst",
              attributes: ["fullname", "nsuId"],
            },
          },
          {
            model: ComplaintEvidence,
            attributes: {
              exclude: ["complaintToken"],
            },
          },
          {
            model: ComplaintComment,
            attributes: {
              exclude: ["userToken", "complaintToken"],
            },
            include: {
              model: User,
              as: "author",
              attributes: {
                exclude: ["password", "scannedNsuId"],
              },
            },
          },
        ],
        order: [[ComplaintComment, "createdAt", "ASC"]],
      });

      if (complaint) {
        native.response(req, res, {
          responseCode: "LIST_LOADED",
          message: `Complaint Details Loaded`,
          data: complaint,
          errorLog: {},
        });
      } else {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: `Invalid Complaint Token`,
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
  // api for editing user

  editUser: async (req, res) => {
    let unique = "Complaint::New";
    let complaintToken = req.body.complaintToken;
    let complaintAgainstList = JSON.parse(req.body.complaintAgainstList);
    let userToken = req.headers.usertoken;
    let message = req.body.message;
    let oldFiles = JSON.parse(req.body.oldFiles);
    let filePath = path.join(__dirname, "..");
    let evidence;
    if (req.files) {
      evidence = req.files.evidence;
    }

    try {
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

      if ((!evidence || evidence.length === 0) && oldFiles.length === 0) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Please provide some evidence",
          data: {},
          errorLog: {},
        });
        return;
      }

      let currComplaint = await Complaint.findOne({
        where: {
          token: complaintToken,
          status: "Active",
        },
      });

      if (!currComplaint) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "Invalid Complaint ID",
          data: {},
          errorLog: {},
        });
        return;
      }

      if (currComplaint.userToken !== userToken) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "You do not have permission to perform this operation",
          data: {},
          errorLog: {},
        });
        return;
      }

      let newVersion = parseInt(currComplaint.version) + 1;

      let complaintHist = await ComplaintHist.create(currComplaint.toJSON());
      currComplaint.destroy();

      let newComplaint = await Complaint.create({
        token: complaintToken,
        userToken: userToken,
        reviewerToken: complaintHist.reviewerToken,
        description: message,
        version: newVersion,
      });

      let complaintAgainstOldList = await ComplaintAgainst.findAll({
        where: {
          complaintToken: newComplaint.token,
          status: "Active",
        },
      });

      for (let i = 0; i < complaintAgainstOldList.length; i++) {
        const curr_complaynee = complaintAgainstOldList[i];
        await ComplaintAgainstHist.create(curr_complaynee.toJSON());
        await curr_complaynee.destroy();
      }

      for (let i = 0; i < complaintAgainstList.length; i++) {
        const curr_elem = complaintAgainstList[i].token;
        let curr_token = utils.makeToken("CompaintAgainst");
        // console.log(curr_elem);
        await ComplaintAgainst.create({
          token: curr_token,
          complaintToken: complaintToken,
          complaintAgainstToken: curr_elem,
          version: newVersion,
        });
      }

      let oldEvidence = await ComplaintEvidence.findAll({
        where: {
          complaintToken: currComplaint.token,
          status: "Active",
        },
      });

      for (let i = 0; i < oldEvidence.length; i++) {
        const curr_evidence = oldEvidence[i];
        await ComplaintEvidenceHist.create(curr_evidence.toJSON());
        await curr_evidence.destroy();
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
            complaintToken: complaintToken,
            fileName: newFileName,
            originalFileName: curr_file.name,
            version: newVersion,
          });
        }
      } else if (evidence) {
        let curr_file = evidence;
        let curr_token = utils.makeToken("ComplaintEvidence");
        let extension = curr_file.name.split(".").pop();
        let newFileName = `${utils.makeToken("EVIDENCE")}.${extension}`;
        curr_file.mv(`${filePath}/files/${newFileName}`);
        await ComplaintEvidence.create({
          token: curr_token,
          complaintToken: complaintToken,
          fileName: newFileName,
          originalFileName: curr_file.name,
          version: newVersion,
        });
      }

      for (let i = 0; i < oldFiles.length; i++) {
        const curr_file = oldFiles[i];
        await ComplaintEvidence.create({
          token: curr_file.token,
          complaintToken: complaintToken,
          fileName: curr_file.fileName,
          originalFileName: curr_file.originalFileName,
          version: newVersion,
        });
      }

      native.response(req, res, {
        responseCode: "INSERTION_SUCCESSFUL",
        message: "Complaint Successfully Updated",
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

  editHistory: async (req, res) => {
    let unique = "Complaint::All::Version";
    let userToken = req.headers.usertoken;
    let complaintToken = req.params.complaintToken;

    try {
      let editHistory = await ComplaintHist.findAll({
        order: [["version", "DESC"]],
        where: {
          token: complaintToken,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: {
              exclude: ["password", "scannedNsuId"],
            },
          },
          {
            model: User,
            as: "reviewer",
            attributes: {
              exclude: ["password", "scannedNsuId"],
            },
          },
          {
            model: ComplaintAgainstHist,
            attributes: {
              exclude: ["complaintToken", "complaintAgainstToken"],
            },
            where: {
              version: { [Op.col]: "ComplaintHist.version" },
            },
            include: {
              model: User,
              as: "complaintAgainst",
              attributes: {
                exclude: ["password", "scannedNsuId"],
              },
            },
          },
          {
            model: ComplaintEvidenceHist,
            where: {
              version: { [Op.col]: "ComplaintHist.version" },
            },
            attributes: {
              exclude: ["complaintToken"],
            },
          },
        ],
      });

      native.response(req, res, {
        responseCode: "LIST_LOADED",
        message: "Complaint edit history successfully loaded",
        data: {
          itemsCount: editHistory.length,
          items: editHistory,
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
