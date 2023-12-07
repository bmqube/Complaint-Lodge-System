const express = require("express");
const AdminController = require("../controllers/AdminController");
const router = express.Router();
const native = require("../helpers/native");

router.get("/", (req, res) => {
  native.response(req, res, {
    responseCode: "TRY_AGAIN",
    message: "Are you lost?",
    data: {},
    errorLog: {},
  });
});

router.get("/users/all", AdminController.allUsers);

// for disabling specific user
router.post("/user/disable", AdminController.disableUsers);
//for adding new Users
router.post("/add/new/user", AdminController.addNewUser);

router.post("/lodge/complaint", AdminController.lodgeNewComplaint);
router.post("/search/representative", AdminController.searchRepresentative);
router.post("/search/complainee", AdminController.searchComplainee);
router.post("/search/reviewer", AdminController.searchReviewer);



module.exports = router;
