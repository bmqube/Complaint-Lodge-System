import React from "react";
import { useState } from "react";
import { baseUrl } from "../Link";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GoogleLogin from "react-google-login";
import image from "../Images/google.png";
import RegisterWithGoogle from "./RegisterWithGoogle";
import { Modal } from "bootstrap";

// import "./Register.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userToken = localStorage.getItem("userToken");
  const userSessionToken = localStorage.getItem("userSessionToken");
  const [emailClass, setEmailClass] = useState("form-control");
  const [emailLabel, setEmailLabel] = useState("Email");
  const [passwordLabel, setPasswordLabel] = useState("Password");
  const [passwordClass, setPasswordClass] = useState("form-control");
  const [disabled, setDisabled] = useState("false");
  const [check, setCheck] = useState("");
  const [alertClass, setAlertClass] = useState("d-none");
  const [googleId, setGoogleId] = useState("");
  const [extension, setExtension] = useState("");
  const [modalCode, setModalCode] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  let navigate = useNavigate();

  if (userToken) {
    return <Navigate to="/" />;
  }

  if (googleId) {
    return <RegisterWithGoogle token={googleId} extension={extension} />;
  }

  const handleSubmit = async () => {
    setDisabled("disabled");
    if (!email) {
      setEmailClass("form-control is-invalid");
      setEmailLabel("Email can not be empty");
      return;
    }

    if (!password) {
      setPasswordClass("form-control is-invalid");
      setPasswordLabel("Password can not be empty");
      return;
    }

    let response = await axios.post(baseUrl + "/auth/login", {
      email: email,
      password: password,
    });

    if (response.data.responseCode === "LIST_LOADED") {
      setAlertClass("");
      localStorage.setItem("userToken", response.data.data.userToken);
      localStorage.setItem(
        "userSessionToken",
        response.data.data.userSessionToken
      );
      localStorage.setItem("actorType", response.data.data.actorType);
      setTimeout(() => {
        setDisabled("");
        navigate("/");
      }, 1000);
    } else {
      setDisabled("");
      let message = response.data.message;
      if (message.toLowerCase().includes("email")) {
        setEmailClass("form-control is-invalid");
        setEmailLabel(message);
      }

      if (message.toLowerCase().includes("password")) {
        setPasswordClass("form-control is-invalid");
        setPasswordLabel(message);
      }
    }
  };

  const handleEmailChange = (value) => {
    setDisabled("");
    setEmail(value);
    setEmailClass("form-control");
    setEmailLabel("Email");
  };

  const handlePasswordChange = (val) => {
    setDisabled("");
    setPassword(val);
    setPasswordClass("form-control");
    setPasswordLabel("Password");
  };

  const handleCheckChange = (val) => {
    setCheck(!check);
  };

  // const onSignIn = async (googleResponse) => {
  //   let tokenId = googleResponse.getAuthResponse().id_token;
  //   console.log(tokenId);
  //   let response = await axios.post(baseUrl + "/auth/google/login", {
  //     tokenId: tokenId,
  //   });

  //   console.log(response);

  //   if (response.data.responseCode === "LIST_LOADED") {
  //     setAlertClass("");
  //     localStorage.setItem("userToken", response.data.data.userToken);
  //     localStorage.setItem(
  //       "userSessionToken",
  //       response.data.data.userSessionToken
  //     );
  //     setTimeout(() => {
  //       setDisabled("");
  //       navigate("/");
  //     }, 1000);
  //   } else {
  // setDisabled("");
  // let message = response.data.message;
  // if (message.toLowerCase().includes("email")) {
  //   setEmailClass("form-control is-invalid");
  //   setEmailLabel(message);
  // }

  // if (message.toLowerCase().includes("password")) {
  //   setPasswordClass("form-control is-invalid");
  //   setPasswordLabel(message);
  // }
  //   }
  // };

  const onSignIn = async (googleResponse) => {
    let tokenId = googleResponse.getAuthResponse().id_token;
    setExtension(googleResponse.profileObj.email.split("@").pop());
    let response = await axios.post(baseUrl + "/auth/google/login", {
      tokenId: tokenId,
    });

    if (response.data.responseCode === "LIST_LOADED") {
      setEmail("");
      setPassword("");
      setAlertClass("");
      localStorage.setItem("userToken", response.data.data.userToken);
      localStorage.setItem(
        "userSessionToken",
        response.data.data.userSessionToken
      );
      localStorage.setItem("actorType", response.data.data.actorType);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      if (response.data.responseCode === "AUTH_ERROR") {
        setGoogleId(tokenId);
      } else {
        setDisabled("");
        let message = response.data.message;
        if (message.toLowerCase().includes("email")) {
          setEmailClass("form-control is-invalid");
          setEmailLabel(message);
        } else if (message.toLowerCase().includes("password")) {
          setPasswordClass("form-control is-invalid");
          setPasswordLabel(message);
        } else {
          setModalCode(false);
          setResponseMessage(responseMessage);
          let modal = new Modal(document.getElementById("successModal"));
          modal.show();
        }
      }
    }
  };

  return (
    <div
      class="d-flex flex-column justify-content-start"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <div className="mx-auto col-10 col-md-8 col-lg-4 shadow p-3 mt-5 mb-2 bg-body rounded border">
        <div className="mb-4 mt-3 d-flex">
          <h3 className="border-bottom border-success border-5 p-2">Sign In</h3>
        </div>
        <form>
          <div className="mb-3 form-floating">
            <input
              type="text"
              readonly
              className={emailClass}
              id="staticEmail"
              placeholder="Enter Your Email"
              value={email}
              onChange={(ele) => {
                handleEmailChange(ele.target.value);
              }}
            />
            <label for="staticEmail">{emailLabel}</label>
          </div>
          <div className="mb-3 form-floating">
            <input
              type="password"
              className={passwordClass}
              id="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(ele) => handlePasswordChange(ele.target.value)}
            />
            <label for="password">{passwordLabel}</label>
          </div>
          <div class="mb-3 form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
              checked={check.toString()}
              onChange={(ele) => handleCheckChange(ele)}
            />

            <label className="form-check-label" for="exampleCheck1">
              Remember Me
            </label>
            <a
              href="/forget/password"
              className="ms-5  float-end text-decoration-none"
            >
              <strong className="text-success">Forget Password?</strong>
            </a>
          </div>
          <div class={"alert alert-primary " + alertClass} role="alert">
            Sign In Successful
          </div>
          <div className="d-grid gap-2 text-center">
            <button
              type="button"
              className={"my-3 btn btn-success btn-lg " + disabled}
              onClick={handleSubmit}
            >
              Sign In
            </button>
            <GoogleLogin
              render={(renderprops) => (
                <button
                  type="button"
                  className={"btn btn-light border border-2 btn-lg"}
                  onClick={renderprops.onClick}
                  disabled={renderprops.disabled}
                >
                  <img src={image} className="me-2" height="35px" alt="" />
                  Sign In with Google
                </button>
              )}
              clientId="920545029466-83ludcj54g1m718gt172fc9hqpo8ofok.apps.googleusercontent.com"
              onSuccess={onSignIn}
              onFailure={onSignIn}
            />
          </div>
        </form>
      </div>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <a href="/register" className="text-decoration-none">
          <strong className="text-success">Sign Up</strong>
        </a>
      </p>
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
