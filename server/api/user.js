const express = require("express");
const router = express.Router();
const native = require("../helpers/native");
const UserController = require("../controllers/UserController");
// require("../associations");

router.get("/", (req, res) => {
  native.response(req, res, {
    responseCode: "TRY_AGAIN",
    message: "Are you lost?",
    data: {},
    errorLog: {},
  });
});

//api for user profile
router.get("/profile", UserController.getProfile);

// api for all complaints with paging
router.get("/lodged/all", UserController.allLodgedComplaint);

// api for all review complaints with paging
router.get("/review/all", UserController.allComplaintsToReview);

module.exports = router;
