import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../Link";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Modal } from "bootstrap";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordLabel, setPasswordLabel] = useState("Password");
  const [passwordClass, setPasswordClass] = useState("form-control");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordLabel, setConfirmPasswordLabel] =
    useState("Confirm Password");
  const [confirmPasswordClass, setConfirmPasswordClass] =
    useState("form-control");
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [status, setStatus] = useState("");
  const userToken = localStorage.getItem("userToken");

  let { token } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      let response = await axios.get(baseUrl + "/auth/verify/token/" + token);
      setIsValid(response.data.responseCode === "LIST_LOADED");
      setMessage(response.data.message);
      // console.log(response.data);
    }
    getData();
  }, []);

  if (userToken) {
    return <Navigate to="/" />;
  }

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (val.length < 8 || val.length > 20) {
      setPasswordClass("form-control is-invalid");
      setPasswordLabel("Password must be 8-20 characters long.");
    } else {
      setPasswordClass("form-control");
      setPasswordLabel("Password");
    }
  };
  const handleSubmit = async (ele) => {
    ele.preventDefault();
    if (!password) {
      setPasswordClass("form-control is-invalid");
      setPasswordLabel("Password can not be empty");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordClass("form-control is-invalid");
      setConfirmPasswordLabel("Password does not match");
      return;
    }
    if (password.length < 8 || password.length > 20) {
      setPasswordClass("form-control is-invalid");
      setPasswordLabel("Password must be 8-20 characters long.");
      return;
    }
    let response = await axios.post(baseUrl + "/auth/reset/password/" + token, {
      resetToken: token,
      password: password,
    });
    setStatus(response.data.responseCode);
    setResetMessage(response.data.message);
    // console.log(response.data.responseCode);

    let modal = new Modal(document.getElementById("successModal"));
    modal.show();
    setTimeout(() => {
      modal.hide();
      navigate("/");
    }, 1000);
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
      {isValid ? (
        <div class="row">
          <div className="mx-auto col-10 col-md-8 col-lg-4 shadow p-3 mt-5 mb-2 bg-body rounded border">
            <div className="mb-4 mt-3 d-flex">
              <h1 className="border-bottom border-success border-5 p-2">
                Reset Password
              </h1>
            </div>
            <form>
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
                  onChange={(ele) =>
                    handleConfirmPasswordChange(ele.target.value)
                  }
                />
                <label for="confirmPassword">{confirmPasswordLabel}</label>
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="mx-5 my-3 btn btn-success btn-lg"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div class="row">
          <div className="mx-auto col-10 col-md-8 col-lg-4 shadow p-3 mt-5 mb-2 bg-body rounded border">
            <div className="mb-4 mt-3 d-flex justify-content-center">
              <form>
                <div className="fs-4 mx-auto text-success mb-3 d-flex justify-content-center">
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
                </div>
                <div className="text-success fs-4"> {message}</div>
              </form>
            </div>
          </div>
        </div>
      )}
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
                {status === "INSERTION_SUCCESSFUL" ? (
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
                    width="100"
                    height="100"
                    fill="currentColor"
                    class="bi bi-x-lg"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"
                    />
                  </svg>
                )}
              </div>
              <br />
              {resetMessage}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
