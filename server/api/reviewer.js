const express = require("express");
const native = require("../helpers/native");
const router = express.Router();
const ReviewerController = require("../controllers/ReviewerController");

router.get("/", (req, res) => {
  native.response(req, res, {
    responseCode: "TRY_AGAIN",
    message: "Are you lost?",
    data: {},
    errorLog: {},
  });
});

// api for  new comment
router.post("/new/comment",ReviewerController.newComment);

// api for closing complaint
router.get("/close/complaint/:complaintToken", ReviewerController.closeComplaint);

// api for changing reviwer
router.put("/edit/complaint", ReviewerController.editComplaint);

module.exports = router;
