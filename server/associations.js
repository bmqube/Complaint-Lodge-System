const User = require("./models/User");
const Complaint = require("./models/Complaint");
const ComplaintComment = require("./models/ComplaintComment");
const ComplaintAgainst = require("./models/ComplaintAgainst");
const ComplaintEvidence = require("./models/ComplaintEvidence");
const ComplaintHist = require("./models/ComplaintHist");
const ComplaintAgainstHist = require("./models/ComplaintAgainstHist");
const ComplaintEvidenceHist = require("./models/ComplaintEvidenceHist");

Complaint.belongsTo(User, {
  foreignKey: "userToken",
  as: "user",
});
Complaint.belongsTo(User, {
  foreignKey: "reviewerToken",
  as: "reviewer",
});
Complaint.hasMany(ComplaintAgainst, {
  foreignKey: "complaintToken",
});
Complaint.hasMany(ComplaintEvidence, {
  foreignKey: "complaintToken",
});
Complaint.hasMany(ComplaintComment, {
  foreignKey: "complaintToken",
});
ComplaintAgainst.belongsTo(User, {
  foreignKey: "complaintAgainstToken",
  as: "complaintAgainst",
});
ComplaintComment.belongsTo(User, {
  foreignKey: "userToken",
  as: "author",
});

ComplaintHist.belongsTo(User, {
  foreignKey: "userToken",
  as: "user",
});
ComplaintHist.belongsTo(User, {
  foreignKey: "reviewerToken",
  as: "reviewer",
});
ComplaintHist.hasMany(ComplaintAgainstHist, {
  foreignKey: "complaintToken",
});
ComplaintHist.hasMany(ComplaintEvidenceHist, {
  foreignKey: "complaintToken",
});
ComplaintAgainstHist.belongsTo(User, {
  foreignKey: "complaintAgainstToken",
  as: "complaintAgainst",
});
