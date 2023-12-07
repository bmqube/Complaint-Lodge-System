import React, { useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";

import { Container } from "@mui/material";
import axios from "axios";
import { baseUrl } from "../Link";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "bootstrap";
export default function ChangeReviewer() {
  const [reviewer, setReviewer] = useState("");
  let userToken = localStorage.getItem("userToken");
  let userSessionToken = localStorage.getItem("userSessionToken");
  const [modalCode, setModalCode] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");

  let { token } = useParams();
  let navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      console.log(reviewer);
      let response = await axios.put(
        baseUrl + "/reviewer/edit/complaint",
        {
          complaintToken: token,
          newReviewerToken: reviewer.token,
        },
        {
          headers: {
            userToken: userToken,
            userSessionToken: userSessionToken,
          },
        }
      );

      let modal = new Modal(document.querySelector("#successModal"));

      if (response.data.responseCode === "INSERTION_SUCCESSFUL") {
        setModalCode(true);
        setTimeout(() => {
          modal.hide();
          navigate("/");
        }, 1000);
      } else {
        setModalCode(false);
      }
      if (response.data.responseCode === "SESSION_EXPIRED") {
        localStorage.clear();
        navigate("/");
      }
      setResponseMessage(response.data.message);

      modal.show();
    } catch (error) {
      setModalCode(false);
      setResponseMessage(error ?? "Something went wrong");
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
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "white",
          mt: "5rem",
          pt: "3rem",
          pb: "2rem",
          borderRadius: "0.5rem",
          boxShadow: 3,
        }}
      >
        <div className="mb-4 mt-3 d-flex">
          <h3 className="border-bottom border-success border-5 p-2">
            Change Reviewer
          </h3>
        </div>
        <SearchBar
          label="Choose Reviewer"
          set={setReviewer}
          multiple={false}
          sx={{ mt: "1rem" }}
          searchFor="reviewer"
        />
        <button
          type="button"
          className={"my-3 btn btn-success btn-lg float-end"}
          onClick={handleSubmit}
        >
          Change
        </button>
      </Container>
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
