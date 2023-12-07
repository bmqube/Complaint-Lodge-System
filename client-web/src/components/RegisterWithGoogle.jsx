import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { baseUrl } from "../Link";
import Navbar from "./Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function RegisterWithGoogle(props) {
  const { token, extension } = props;
  const [nsuId, setNsuId] = useState("");

  const [nsuIdClass, setNsuIdClass] = useState("form-control");
  const [nsuIdLabel, setNsuIdLabel] = useState("NSU ID");
  const [userType, setUserType] = useState("");
  const [userTypeClass, setUserTypeClass] = useState("form-control");
  const [userTypeLabel, setUserTypeLabel] = useState("Select an Option");
  const [scannedNsuId, setScannedNsuId] = useState(null);
  const [scannedNsuIdClass, setScannedNsuIdClass] = useState("form-control");
  const [scannedNsuIdLabel, setScannedNsuIdLabel] = useState("Scanned NSU ID");
  const [modalMessage, setModalMessage] = useState("");
  let userToken = localStorage.getItem("userToken");
  let navigate = useNavigate();
  // console.log(extension);

  if (userToken) {
    return <Navigate to="/" />;
  }
  const handleSubmit = async (ele) => {
    ele.preventDefault();

    if (!nsuId && extension !== "northsouth.edu") {
      setNsuIdClass("form-control is-invalid");
      setNsuIdLabel("NSU ID can not be empty");
      return;
    }

    if (!userType) {
      setUserTypeClass("form-control is-invalid");
      setUserTypeLabel("Please Select User Type");
      return;
    }

    if (!scannedNsuId) {
      setScannedNsuIdClass("form-control is-invalid");
      setScannedNsuIdLabel("Please Upload Scanned NSU ID");
      return;
    }

    let body = new FormData();
    body.append("tokenId", token);
    body.append("nsuId", nsuId);
    body.append("userType", userType);
    body.append("scannedNsuId", scannedNsuId);
    console.log(body);

    let response = await axios.post(baseUrl + "/auth/google/register", body);

    if (response.data.responseCode === "LIST_LOADED") {
      setNsuId("");
      setUserType("");
      setScannedNsuId("");
      localStorage.setItem("userToken", response.data.data.userToken);
      localStorage.setItem(
        "userSessionToken",
        response.data.data.userSessionToken
      );
      localStorage.setItem("actorType", response.data.data.actorType);
      setModalMessage("Registration Completed");
      let modal = new Modal(document.getElementById("successModal"));
      modal.show();

      setTimeout(() => {
        modal.hide();
        navigate("/");
      }, 1000);
    } else {
      let responseMessage = response.data.message;

      if (responseMessage.toLowerCase().includes("id")) {
        setNsuIdClass("form-control is-invalid");
        setNsuIdLabel(responseMessage);
      } else {
        setModalMessage(responseMessage);
        let modal = new Modal(document.getElementById("successModal"));
        modal.show();
      }
    }
  };

  const handleNsuIdChange = (value) => {
    setNsuId(value);
    setNsuIdClass("form-control");
    setNsuIdLabel("NSU ID");
  };

  return (
    <div
      class="d-flex flex-column justify-content-start"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <div className="mx-auto col-10 col-md-8 col-lg-6 col-xl-4 shadow p-3 mt-5 mb-2 bg-body rounded border">
        <div className="mb-4 mt-3 d-flex">
          <h1 className="border-bottom border-success border-5 p-2">Sign Up</h1>
        </div>
        <form>
          <div className="mb-3 form-floating">
            <input
              type="text"
              className={nsuIdClass}
              placeholder="NSU ID"
              id="staticNsuId"
              value={nsuId}
              hidden={extension === "northsouth.edu" ? true : false}
              onInput={(ele) => handleNsuIdChange(ele.target.value)}
            />

            <label for="staticEmail">{nsuIdLabel}</label>
          </div>
          {extension === "northsouth.edu" ? (
            <div className="form-floating mb-3">
              <select
                class={userTypeClass}
                id="floatingSelect1"
                value={userType}
                onChange={(e) => {
                  setUserTypeClass("form-control");
                  setUserTypeLabel("Select an Option");
                  setUserType(e.target.value);
                }}
                disabled={false}
              >
                <option selected>Open this select menu</option>
                <option value="Faculty">Faculty</option>
                <option value="Admin">Admin</option>
                <option value="Student">Student</option>
              </select>
              <label for="floatingSelect">{userTypeLabel}</label>
            </div>
          ) : (
            <div className="form-floating mb-3">
              <select
                class={userTypeClass}
                id="floatingSelect2"
                value={userType}
                onChange={(e) => {
                  setUserTypeClass("form-control");
                  setUserTypeLabel("Select an Option");
                  setUserType(e.target.value);
                }}
                disabled={false}
              >
                <option selected>Open this select menu</option>
                <option value="Helper">Helper</option>
              </select>
              <label for="floatingSelect">{userTypeLabel}</label>
            </div>
          )}

          <div className="mb-4 d-grid gap-2">
            <label for="customFile">{scannedNsuIdLabel}</label>
            <input
              type="file"
              // style={{ display: "none" }}
              className={scannedNsuIdClass}
              id="customFile"
              onChange={(ele) => {
                setScannedNsuIdClass("form-control");
                setScannedNsuIdLabel("Scanned NSU ID");
                setScannedNsuId(ele.target.files[0]);
              }}
            />
          </div>

          <div class="mb-3 form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
            />
            <label class="form-check-label" for="exampleCheck1">
              I accept the Terms of Use & Privacy Policy
            </label>
          </div>

          <div className="d-grid gap-2">
            <button
              type="button"
              className="my-3 btn btn-success btn-lg"
              onClick={handleSubmit}
            >
              Complete Registration
            </button>
          </div>
        </form>
      </div>
      {/* <div className="text-center my-3">
        Already have an account?
        <a href="/login" className="text-decoration-none">
          <strong className="text-success">Sign in</strong>
        </a>
      </div> */}
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
              </div>
              <br />
              {modalMessage}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
