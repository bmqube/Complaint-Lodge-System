const nodemailer = require("nodemailer");
const { mailer, links } = require("../config.json");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailer.email,
    pass: mailer.password,
  },
});

const sendVerificationEmail = async (emailToSend, verificationToken) => {
  const mailOptions = {
    from: "NSU CLS",
    to: emailToSend,
    subject: "NSU CLS - Email Verification",
    text: `Please verify your email using the following link: ${links.frontendUrl}/email/verify/${verificationToken}`,
  };

  await transporter.sendMail(mailOptions);
};

const sendEmailToAddedUser = async (emailToSend) => {
  const mailOptions = {
    from: "NSU CLS",
    to: emailToSend,
    subject: "NSU CLS - Email Confirmation",
    text: `You have been added as a user to NSU-CLS!`,
  };

  await transporter.sendMail(mailOptions);
};

const sendComplaintUpdateEmail = async (emailToSend, complaintToken) => {
  const mailOptions = {
    from: "NSU CLS",
    to: emailToSend,
    subject: "NSU CLS - Updating Complaint",
    text: `Complaint with id:${complaintToken} has been updated.To check,please visit the website NSU-CLS.`,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (emailToSend, verificationToken) => {
  const mailOptions = {
    from: "NSU CLS",
    to: emailToSend,
    subject: "NSU CLS - Reset Password",
    text: `Please reset your password with the link below: ${links.frontendUrl}/reset/password/${verificationToken}`,
  };

  await transporter.sendMail(mailOptions);
};

exports.sendVerificationEmail = sendVerificationEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.sendComplaintUpdateEmail = sendComplaintUpdateEmail;
exports.sendEmailToAddedUser = sendEmailToAddedUser;
