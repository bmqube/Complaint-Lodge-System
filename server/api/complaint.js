const express = require("express");
const native = require("../helpers/native");
const router = express.Router();
const ComplaintController = require("../controllers/ComplaintController");

router.get("/", (req, res) => {
  native.response(req, res, {
    responseCode: "TRY_AGAIN",
    message: "Are you lost?",
    data: {},
    errorLog: {},
  });
});

// api for searching user for complaint
router.post("/search/all", ComplaintController.searchUser);

// api for searching reviewer for complaint
router.post("/search/reviewer", ComplaintController.searchReviewer);

// api for lodging new complaint
router.post("/new", ComplaintController.newComplaint);

// api for lodging new complaint (app)
router.post("/app/new", ComplaintController.newAppComplaint);

// api for complaint details
router.get("/details/:complaintToken", ComplaintController.complaintDetails);

// api for editing user
router.put("/edit/user", ComplaintController.editUser);

router.get("/edit/history/:complaintToken", ComplaintController.editHistory);

module.exports = router;
