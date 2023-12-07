import React from "react";
import { useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { baseUrl } from "../Link";
import Navbar from "./Navbar";
import { Navigate, useNavigate } from "react-router-dom";
import Footer from "./Footer";
function CreateAccountBySysAdmin() {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nsuId, setNsuId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [fullnameLabel, setFullnameLabel] = useState("Fullname");
  const [fullnameClass, setFullnameClass] = useState("form-control");
  const [emailLabel, setEmailLabel] = useState("Email");
  const [emailClass, setEmailClass] = useState("form-control");
  const [passwordLabel, setPasswordLabel] = useState("Password");
  const [passwordClass, setPasswordClass] = useState("form-control");
  const [confirmPasswordLabel, setConfirmPasswordLabel] =
    useState("Confirm Password");
  const [confirmPasswordClass, setConfirmPasswordClass] =
    useState("form-control");
  const [nsuIdClass, setNsuIdClass] = useState("form-control");
  const [nsuIdLabel, setNsuIdLabel] = useState("NSU ID");
  const [userTypeClass, setUserTypeClass] = useState("form-control");
  const [userTypeLabel, setUserTypeLabel] = useState("Select User Type");
  const [scannedNsuId, setScannedNsuId] = useState(null);
  const [scannedNsuIdClass, setScannedNsuIdClass] = useState("form-control");
  const [scannedNsuIdLabel, setScannedNsuIdLabel] = useState("Scanned NSU ID");
  let userToken = localStorage.getItem("userToken");
  let userSessionToken = localStorage.getItem("userSessionToken");
  let actorType = localStorage.getItem("actorType");

  const [extension, setExtension] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [modalCode, setModalCode] = useState(true);
  let status = "";
  let navigate = useNavigate();

  if (actorType !== "SysAdmin") {
    return <Navigate to="/" />;
  }
  const handleSubmit = async (ele) => {
    ele.preventDefault();
    if (!fullname) {
      setFullnameClass("form-control is-invalid");
      setFullnameLabel("Fullname can not be empty");
      return;
    }
    if (fullname.length > 50) {
      setFullnameClass("form-control is-invalid");
      setFullnameLabel("Fullname can not be more than 50 characters");
      return;
    }

    if (!nsuId) {
      setNsuIdClass("form-control is-invalid");
      setNsuIdLabel("NSU ID can not be empty");
      return;
    }
    if (nsuId.length > 10) {
      setNsuIdClass("form-control is-invalid");
      setNsuIdLabel("NSU ID can not be more than 10 digits");
      return;
    }
    if (!email) {
      setEmailClass("form-control is-invalid");
      setEmailLabel("Email can not be empty");
      return;
    }
    if (email.length > 50) {
      setEmailClass("form-control is-invalid");
      setEmailLabel("Email can not be more than 50 characters");
      return;
    }

    if (!password) {
      setPasswordClass("form-control is-invalid");
      setPasswordLabel("Password can not be empty");
      return;
    }

    if (password.length < 8 || password.length > 20) {
      setPasswordClass("form-control is-invalid");
      setPasswordLabel("Password must be 8-20 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordClass("form-control is-invalid");
      setConfirmPasswordLabel("Password does not match");
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
    body.append("fullname", fullname);
    body.append("nsuId", nsuId);
    body.append("email", email);
    body.append("password", password);
    body.append("userType", userType);
    body.append("scannedNsuId", scannedNsuId);

    let response = await axios.post(baseUrl + "/admin/add/new/user", body, {
      headers: {
        userToken: userToken,
        userSessionToken: userSessionToken,
      },
    });
    if (response.data.responseCode === "INSERTION_SUCCESSFUL") {
      setFullName("");
      setNsuId("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserType("");
      setScannedNsuId(null);
      setModalCode(true);
      setResponseMessage(response.data.message);
      let modal = new Modal(document.getElementById("successModal"));
      modal.show();
    } else {
      let responseMessage = response.data.message;
      if (responseMessage.toLowerCase().includes("email")) {
        setEmailClass("form-control is-invalid");
        setEmailLabel(responseMessage);
      } else if (responseMessage.toLowerCase().includes("id")) {
        setNsuIdClass("form-control is-invalid");
        setNsuIdLabel(responseMessage);
      } else {
        setModalCode(false);
        setResponseMessage(responseMessage);
        let modal = new Modal(document.getElementById("successModal"));
        modal.show();
      }
    }
    console.log(response);
  };
  const change = () => {
    if (validateEmail(email)) {
      const ext = email.split("@").pop();
      if (ext === "northsouth.edu") {
        status = "nsu";
      } else {
        status = "others";
      }
    }
  };

  const validateEmail = (e) => {
    return String(e)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleEmailChange = (value) => {
    setEmail(value);

    if (!validateEmail(value) || value.length > 50) {
      setEmailClass("form-control is-invalid");
      setEmailLabel("Invalid Email");
    } else {
      setEmailClass("form-control");
      setEmailLabel("Email");
    }
  };
  const handleFullnameChange = (value) => {
    setFullName(value);
    if (value.length > 50) {
      setFullnameClass("form-control is-invalid");
      setFullnameLabel("Fullname cannot be more than 50 characters");
    } else {
      setFullnameClass("form-control");
      setFullnameLabel("Fullname");
    }
  };
  const handleNsuIdChange = (value) => {
    setNsuId(value);
    if (value.length > 10) {
      setNsuIdClass("form-control is-invalid");
      setNsuIdLabel("NSU ID cannot be more than 10 digits");
    } else if (!(value >= 1 || value <= 9)) {
      setNsuIdClass("form-control is-invalid");
      setNsuIdLabel("NSU ID should only consists of digits");
    } else {
      setNsuIdClass("form-control");
      setNsuIdLabel("NSU ID");
    }
  };
  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value.length < 8 || value.length > 20) {
      setPasswordClass("form-control is-invalid");
      setPasswordLabel("Password must be 8-20 characters long.");
    } else {
      setPasswordClass("form-control");
      setPasswordLabel("Password");
    }
  };
  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (password !== value) {
      setConfirmPasswordClass("form-control is-invalid");
      setConfirmPasswordLabel("Password does not match");
    } else {
      setConfirmPasswordClass("form-control");
      setConfirmPasswordLabel("Confirm Password");
    }
  };
  return (
    <div
      class="d-flex flex-column justify-content-start"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <div className="mx-auto col-10 col-md-8 col-lg-6 col-xl-4 shadow p-3 mt-5 mb-2 bg-body rounded border">
        <div className="mb-4 mt-3 d-flex">
          <h1 className="border-bottom border-success border-5 p-2">
            Add New User
          </h1>
        </div>
        <form onChange={change()}>
          <div className="mb-3 form-floating">
            <input
              type="text"
              className={fullnameClass}
              id="fullname"
              placeholder="Enter Your FullName"
              value={fullname}
              maxLength="50"
              onChange={(ele) => handleFullnameChange(ele.target.value)}
            />
            <label for="fullname">{fullnameLabel}</label>
          </div>
          <div className="mb-3 form-floating">
            <input
              type="text"
              className={nsuIdClass}
              placeholder="NSU ID"
              id="staticNsuId"
              value={nsuId}
              maxLength="10"
              onInput={(ele) => handleNsuIdChange(ele.target.value)}
            />

            <label for="staticEmail">{nsuIdLabel}</label>
          </div>
          <div className="mb-3 form-floating">
            <input
              type="text"
              className={emailClass}
              placeholder="Enter Your Email"
              id="staticEmail"
              maxLength="50"
              value={email}
              onInput={(ele) => handleEmailChange(ele.target.value)}
            />

            <label for="staticEmail">{emailLabel}</label>
          </div>
          <div className="mb-3 form-floating">
            <input
              type="password"
              className={passwordClass}
              id="password"
              placeholder="Must be 8-20 characters long."
              value={password}
              onChange={(ele) => handlePasswordChange(ele.target.value)}
            />
            <label for="password">{passwordLabel}</label>
          </div>
          <div className="mb-3 form-floating">
            <input
              type="password"
              className={confirmPasswordClass}
              id="confirmPassword"
              placeholder="Must be 8-20 characters long."
              value={confirmPassword}
              onChange={(ele) => handleConfirmPasswordChange(ele.target.value)}
            />
            <label for="confirmPassword">{confirmPasswordLabel}</label>
          </div>
          {status === "nsu" ? (
            <div className="form-floating mb-3">
              <select
                class={userTypeClass}
                id="floatingSelect1"
                aria-label="Floating label select example"
                value={userType}
                onChange={(e) => {
                  setUserTypeLabel("Select User Type");
                  setUserTypeClass("form-select");
                  setUserType(e.target.value);
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
          ) : status === "others" ? (
            <div className="form-floating mb-3">
              <select
                class={userTypeClass}
                id="floatingSelect2"
                value={userType}
                onChange={(e) => {
                  setUserTypeLabel("Select User Type");
                  setUserTypeClass("form-select");
                  setUserType(e.target.value);
                }}
                disabled={false}
              >
                <option selected>Open this select menu</option>
                <option value="Helper">Helper</option>
              </select>
              {/* {userType} */}
              <label for="floatingSelect">{userTypeLabel}</label>
            </div>
          ) : (
            <div className="form-floating mb-3">
              <select
                class={userTypeClass}
                id="floatingSelect2"
                value={userType}
                disabled={false}
              >
                <option selected>Enter Valid Email First</option>
              </select>
              <label for="floatingSelect">{userTypeLabel}</label>
            </div>
          )}

          <div className="mb-4 d-grid gap-2">
            <label for="customFile">Scanned NSU ID</label>
            <input
              type="file"
              // style={{ display: "none" }}
              className="form-control"
              id="customFile"
              onChange={(ele) => setScannedNsuId(ele.target.files[0])}
            />
          </div>

          <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" />
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
              Add New User
            </button>
          </div>
        </form>
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

export default CreateAccountBySysAdmin;
