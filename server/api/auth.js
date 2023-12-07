const express = require("express");
const native = require("../helpers/native");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.get("/", (req, res) => {
  native.response(req, res, {
    responseCode: "TRY_AGAIN",
    message: "Are you lost?",
    data: {},
    errorLog: {},
  });
});

// api for register

router.post("/register", AuthController.register);

// api for login
router.post("/login", AuthController.login);

// api for email verification
router.get(
  "/verify/email/:verificationToken",
  AuthController.emailVerification
);

// api for forget password
router.get("/forget/password/:email", AuthController.forgetPassword);

// api for verifying reset token
router.get("/verify/token/:resetToken", AuthController.verifyResetToken);

// api for reset token for reseting password
router.post("/reset/password/:resetToken", AuthController.resetPassword);

// api for google login
router.post("/google/login", AuthController.googleLogin);

// api for google register
router.post("/google/register", AuthController.googleRegister);

module.exports = router;
