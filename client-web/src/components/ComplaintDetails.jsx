import axios from "axios";
import { Modal } from "bootstrap";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { baseUrl, imageUrl } from "../Link";
import ComplaintComment from "./ComplaintComment";
import ComplaintItem from "./ComplaintItem";
import Footer from "./Footer";
import Navbar from "./Navbar";
import attachmentIcon from "../Images/attachment_icon.png";

export default function ComplaintDetails() {
  const [listOfComplainee, setListOfComplainee] = useState("");
  const [listOfEvidence, setListOfEvidence] = useState([]);
  const [listOfMessage, setListOfMessage] = useState([]);
  const [complaintObject, setComplaintObject] = useState({});
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const [indicator, setIndicator] = useState(true);
  const [modalCode, setModalCode] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  const [nameOfLodger, setNameOfLodger] = useState("");
  const [nameOfReviewer, setNameOfReviewer] = useState("");
  const [lodgerToken, setLodgerToken] = useState("");
  const [reviewerToken, setReviewerToken] = useState("");
  // const [complaintToken, setComplaintToken] = useState("")
  let { token } = useParams();
  let userToken = localStorage.getItem("userToken");
  let userSessionToken = localStorage.getItem("userSessionToken");
  let navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      // let res = await axios.get(baseUrl + "/complaint/edit/history/" + token, {
      //   headers: {
      //     userToken: userToken,
      //     userSessionToken: userSessionToken,
      //   },
      // });

      // console.log(res.data);

      let response = await axios.get(baseUrl + "/complaint/details/" + token, {
        headers: {
          userToken: userToken,
          userSessionToken: userSessionToken,
        },
      });
      console.log(response);
      if (response.data.responseCode === "LIST_LOADED") {
        let data = response.data.data;
        console.log(data);
        let temp = "";
        for (let i = 0; i < data.ComplaintAgainsts.length; i++) {
          const curr_complainee = data.ComplaintAgainsts[i];
          temp += curr_complainee.complaintAgainst.fullname;
          if (i < data.ComplaintAgainsts.length - 1) {
            temp += ", ";
          }
        }
        console.log(response.data.data);
        setListOfComplainee(temp);
        setReviewerToken(data.reviewer.token);
        setDescription(data.description);
        setListOfMessage(data.ComplaintComments);
        setListOfEvidence(data.ComplaintEvidences);
        setNameOfReviewer(data.reviewer.fullname);
        setNameOfLodger(data.user.fullname);
        setLodgerToken(data.user.token);

        temp = {
          status: data.status,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          lodger: data.user,
          reviewer: data.reviewer,
        };

        setComplaintObject(temp);
      }
      if (response.data.responseCode === "SESSION_EXPIRED") {
        localStorage.clear();
        navigate("/");
      }
    }

    getData();
  }, [indicator]);

  const makeComment = async () => {
    try {
      if (comment && comment.length > 0) {
        let response = await axios.post(
          baseUrl + "/reviewer/new/comment",
          {
            comment: comment,
            complaintToken: token,
          },
          {
            headers: {
              userToken: userToken,
              userSessionToken: userSessionToken,
            },
          }
        );

        console.log(response.data);
        setIndicator(!indicator);
        setComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      let response = await axios.get(
        baseUrl + "/reviewer/close/complaint/" + token,
        {
          headers: {
            userToken: userToken,
            userSessionToken: userSessionToken,
          },
        }
      );
      console.log(response);
      if (response.data.responseCode === "INSERTION_SUCCESSFUL") {
        setModalCode(true);
        setResponseMessage(response.data.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setModalCode(false);
        setResponseMessage(response.data.message);
      }
      let modal = new Modal(document.querySelector("#successModal"));
      modal.show();
    } catch (error) {
      setModalCode(false);
      setResponseMessage("Something went wrong");
      let modal = new Modal(document.querySelector("#successModal"));
      modal.show();
    }
  };

  return (
    <div
      class="d-flex flex-column justify-content-start"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <div className="mx-auto col-10 col-md-9 col-lg-8 shadow p-3 my-5 bg-body rounded border">
        <div className="mb-4 mt-3 d-flex justify-content-between">
          <h3 className="border-bottom border-success border-5 p-2">
            Complaint Details
          </h3>
          <div className="d-flex flex-column">
            <a
              href={"/view/edit-history/" + token}
              className="btn btn-sm btn-outline-success"
            >
              View Edit History
            </a>
          </div>
        </div>

        <div className="d-flex">
          <div className="fw-bold me-2">Complaint Against(s): </div>
          <p>{listOfComplainee}</p>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <div className="fw-bold me-2">Status: </div>
            <p>{complaintObject.status}</p>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <div className="fw-bold me-2">Reviewer: </div>
            <p>{nameOfReviewer}</p>
          </div>
        </div>
        <div className="shadow-sm p-3 mb-2 mt-3 border text-break">
          <div className="d-flex">
            <div className="fw-bold me-2 text-muted">{nameOfLodger}</div>
            <div className="fs-6 me-2 text-muted">
              {new Date(complaintObject.createdAt).toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="fs-6  text-muted">
              {new Date(complaintObject.createdAt).toLocaleTimeString("en-GB", {
                hour12: false,
                hour: "numeric",
                minute: "numeric",
              })}
            </div>
          </div>
          {description}
          <div className="ms-2 mt-4">
            <div className="text-muted">Attachments:</div>
            {listOfEvidence.map((e) => (
              <div>
                <a href={imageUrl + e.fileName}>
                  {" "}
                  <img height="20px" src={attachmentIcon} />{" "}
                  {e.originalFileName}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4 me-3">
          {listOfMessage.map((e) => (
            <ComplaintComment message={e} />
          ))}
        </div>
        {reviewerToken === userToken && complaintObject.status === "Active" ? (
          <div>
            <div className="d-flex me-2">
              <div class="mb-3 form-floating col-10 me-2">
                <textarea
                  class="form-control"
                  id="comment"
                  rows="3"
                  maxLength="200"
                  onInput={(e) => setComment(e.target.value)}
                  value={comment}
                ></textarea>
                <label for="comment">Make a comment</label>
              </div>
              <button
                type="button"
                class="btn btn-success mb-3 col-2"
                onClick={makeComment}
              >
                Enter
              </button>
            </div>{" "}
            <div className="row">
              <div className="col-6 d-grid gap-2">
                <button
                  type="button"
                  class="btn btn-danger"
                  onClick={handleSubmit}
                >
                  Mark as resolved
                </button>
              </div>
              <div className="col-6 d-grid gap-2">
                <a class="btn btn-primary" href={"/change/reviewer/" + token}>
                  Change Reviewer
                </a>
              </div>
            </div>
          </div>
        ) : lodgerToken === userToken && complaintObject.status === "Active" ? (
          <div className="d-grid gap-2">
            <a class="btn btn-danger" href={"/complaint/edit/" + token}>
              Edit Complaint
            </a>
          </div>
        ) : (
          ""
        )}
        {/* <div className="d-grid gap-2 text-center"> */}

        {/* </div> */}
      </div>
      <div
        class="modal fade"
        id="successModal"
        tabindex="-1"
        aria-labelledby="successModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body d-flex pb-4 fs-5 flex-column justify-content-center align-items-center text-success">
              <div className="min-vh-25">
                {modalCode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100"
                    height="100"
                    fill="currentColor"
                    class="bi bi-check"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    fill="currentColor"
                    class="bi bi-exclamation-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                  </svg>
                )}
              </div>
              <br />
              {responseMessage}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
