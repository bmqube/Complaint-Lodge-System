import React from "react";
import profilePic from "../Images/google.png";

export default function ComplaintComment({ message }) {
  if (message.commentType === "Update") {
    return (
      <div className="row ms-4 my-2">
        <div class="alert alert-success" role="alert">
          {message.comment}
        </div>
      </div>
    );
  }
  return (
    <div className="row ms-4 my-2">
      <div className="shadow-sm p-3 mb-2 rounded border box">
        <div className="d-flex ">
          <div className="fw-bold me-2  text-muted">
            {message.author.fullname}
          </div>
          <div className="fs-6 me-2 text-muted">
            {new Date(message.createdAt).toLocaleDateString("en-GB", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="fs-6  text-muted">
            {new Date(message.createdAt).toLocaleTimeString("en-GB", {
              hour12: false,
              hour: "numeric",
              minute: "numeric",
            })}
          </div>
        </div>
        {message.comment}
      </div>
    </div>
  );
}
