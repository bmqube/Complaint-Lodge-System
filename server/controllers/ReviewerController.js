const User = require("../models/User");
const Complaint = require("../models/Complaint");
const ComplaintComment = require("../models/ComplaintComment");
const native = require("../helpers/native");
const utils = require("../helpers/utils");

module.exports = {
  // api for  new comment

  newComment: async (req, res) => {
    let unique = "Complaint::New::Comment";
    let userToken = req.headers.usertoken;
    let { comment, complaintToken } = req.body;

    try {
      let complaint = await Complaint.findOne({
        where: {
          token: complaintToken,
          status: "Active",
        },
      });

      if (complaint.reviewerToken !== userToken) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: "You do not have permission to perform this action",
          data: {},
          errorLog: {},
        });
        return;
      }

      let token = utils.makeToken("ComplaintComment");
      await ComplaintComment.create({
        token: token,
        userToken: userToken,
        complaintToken: complaintToken,
        commentType: "Comment",
        comment: comment,
      });

      native.response(req, res, {
        responseCode: "INSERTION_SUCCESSFUL",
        message: "Comment added successfully",
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
  // api for closing complaint

  closeComplaint: async (req, res) => {
    let unique = "Complaint::Close";
    let complaintToken = req.params.complaintToken;
    let userToken = req.headers.usertoken;

    try {
      let complaint = await Complaint.findOne({
        where: {
          token: complaintToken,
          reviewerToken: userToken,
        },
      });

      let thisUser = await User.findOne({
        where: {
          token: userToken,
        },
      });

      if (complaint) {
        let token = utils.makeToken("ComplainComment");
        await ComplaintComment.create({
          token: token,
          userToken: userToken,
          complaintToken: complaintToken,
          commentType: "Update",
          comment: `${thisUser.fullname} marked this complaint as resolved`,
        });

        complaint.status = "Resolved";
        await complaint.save();

        native.response(req, res, {
          responseCode: "INSERTION_SUCCESSFUL",
          message: `Complaint has been marked as resolved`,
          data: complaint,
          errorLog: {},
        });
      } else {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: `You do not have access to perform this operation`,
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
  // api for changing reviwer and edit complaint

  editComplaint: async (req, res) => {
    let unique = "Complaint::Edit::Reviewer";
    let { complaintToken, newReviewerToken } = req.body;
    let userToken = req.headers.usertoken;
    console.log(req.body);

    try {
      let thisUser = await User.findOne({
        where: {
          token: userToken,
        },
      });

      let newReviewer = await User.findOne({
        where: {
          token: newReviewerToken,
        },
      });

      let complaint = await Complaint.findOne({
        where: {
          token: complaintToken,
          status: "Active",
        },
      });

      if (!complaint) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: `Invalid Complaint ID`,
          data: {},
          errorLog: {},
        });
        return;
      }

      if (complaint.reviewerToken !== userToken) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: `You do not have permission to perform this operation`,
          data: {},
          errorLog: {},
        });
        return;
      }

      if (!newReviewer) {
        native.response(req, res, {
          responseCode: "TRY_AGAIN",
          message: `Invalid Reviewer ID`,
          data: {},
          errorLog: {},
        });
        return;
      }

      let token = utils.makeToken("ComplainComment");
      await ComplaintComment.create({
        token: token,
        userToken: userToken,
        complaintToken: complaintToken,
        commentType: "Update",
        comment: `${thisUser.fullname} assigned ${newReviewer.fullname} as the reviewer of this complaint.`,
      });
      complaint.reviewerToken = newReviewer.token;
      await complaint.save();

      native.response(req, res, {
        responseCode: "INSERTION_SUCCESSFUL",
        message: `Complaint Successfully Updated`,
        data: {},
        errorLog: {},
      });
      return;
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
