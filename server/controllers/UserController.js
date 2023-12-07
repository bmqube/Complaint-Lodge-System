const User = require("../models/User");
const Complaint = require("../models/Complaint");
const ComplaintAgainst = require("../models/ComplaintAgainst");
const native = require("../helpers/native");
const { Op } = require("sequelize");

module.exports = {
  //api for user profile

  getProfile: async (req, res) => {
    let unique = "User::Profile";
    const userToken = req.headers.usertoken;
    try {
      let currUser = await User.findOne({
        attributes: {
          exclude: ["password"],
        },
        where: {
          token: userToken,
        },
      });

      native.response(req, res, {
        responseCode: "LIST_LOADED",
        message: "Profile Found",
        data: currUser,
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
  // api for all complaints with paging

  allLodgedComplaint: async (req, res) => {
    let unique = "User::Lodged::All";
    let userToken = req.headers.usertoken;

    try {
      let complaint = await Complaint.findAll({
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["userToken", "reviewerToken"],
        },
        where: {
          userToken: userToken,
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
        ],
      });

      native.response(req, res, {
        responseCode: "LIST_LOADED",
        message: `Fetched ${complaint.length} Rows`,
        data: {
          items: complaint,
          itemsCount: complaint.length,
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
  // api for all review complaints with paging

  allComplaintsToReview: async (req, res) => {
    let unique = "User::Lodged::All";
    let userToken = req.headers.usertoken;

    try {
      let complaint = await Complaint.findAll({
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["userToken", "reviewerToken"],
        },
        where: {
          reviewerToken: userToken,
          status: { [Op.ne]: "Disabled" },
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
        ],
      });

      native.response(req, res, {
        responseCode: "LIST_LOADED",
        message: `Fetched ${complaint.length} Rows`,
        data: {
          items: complaint,
          itemsCount: complaint.length,
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
