import React, { useEffect, useState } from "react";
import { imageUrl } from "../Link";
import attachmentIcon from "../Images/attachment_icon.png";

export default function EditHistoryCurrentItem({ complaint }) {
  const [listOfComplainee, setListOfComplainee] = useState([]);
  const [listOfEvidence, setListOfEvidence] = useState([]);
  const [lodgerName, setLodgerName] = useState("");
  const [reviewerName, setReviewerName] = useState("")

  console.log(complaint);

  useEffect(() => {
    if (complaint.ComplaintAgainsts) {
      setListOfComplainee(complaint.ComplaintAgainsts);
    }

    if (complaint.ComplaintEvidences) {
      setListOfEvidence(complaint.ComplaintEvidences);
    }

    if (complaint.reviewer) {
      setReviewerName(complaint.reviewer.fullname);
    }

    if (complaint.user) {
      setLodgerName(complaint.user.filename);
    }
  }, [complaint])
  
  return (
    <div className="mb-5 border">
      <div className="border-bottom border-5 border-success p-3">
        <div className="d-flex">
          <div className="fw-bold me-2">Complaint Against(s): </div>
          <p>
            {listOfComplainee.map(
              (e) => e.complaintAgainst.fullname
            ).toString()}
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <div className="fw-bold me-2">Status: </div>
            <p>{complaint.status}</p>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <div className="fw-bold me-2">Reviewer: </div>
            <p>{reviewerName}</p>
          </div>
        </div>
        <div className="shadow-sm p-3 mb-2 mt-3 border text-break">
          <div className="d-flex">
            <div className="fw-bold me-2 text-muted">
              {lodgerName}
            </div>
            <div className="fs-6 me-2 text-muted">
              {new Date(complaint.createdAt).toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="fs-6  text-muted">
              {new Date(complaint.createdAt).toLocaleTimeString("en-GB", {
                hour12: false,
                hour: "numeric",
                minute: "numeric",
              })}
            </div>
          </div>
          {complaint.description}
          <div className="ms-2 mt-4">
            <div className="text-muted">Attachments:</div>
            {listOfEvidence.map((e) => (
              <a href={imageUrl + e.fileName}>
                {" "}
                <img height="20px" src={attachmentIcon} /> {e.originalFileName}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
