import React from "react";
import { useState } from "react";
// import { Navigate } from "react-router-dom";
import { baseUrl } from "../Link";
import { Modal } from "bootstrap";
import Navbar from "./Navbar";
import axios from "axios";
import Footer from "./Footer";
import { Navigate } from "react-router-dom";
export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [emailLabel, setEmailLabel] = useState("Email");
  const [emailClass, setEmailClass] = useState("form-control");
  const userToken = localStorage.getItem("userToken");

  if (userToken) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (ele) => {
    ele.preventDefault();
    if (!email) {
      setEmailClass("form-control is-invalid");
      setEmailLabel("Email can not be empty");
      return;
    }
    let response = await axios.get(baseUrl + "/auth/forget/password/" + email, {
      email: email,
    });

    // let modal = new Modal(document.getElementById("exampleModal"));
    // modal.show();
    console.log("response.data.responseCode");
    if (response.data.responseCode === "INSERTION_SUCCESSFUL") {
      let modal = new Modal(document.getElementById("Modal1"));
      modal.show();
      // console.log("llo");
    } else {
      let responseMessage = response.data.message;

      setEmailClass("form-control is-invalid");
      setEmailLabel(responseMessage);
    }

    // console.log(response.data.responseCode);
    // return <Navigate to="/resetPassword" />;
  };
  const handleEmailChange = (value) => {
    setEmail(value);
    if (!value) {
      setEmailClass("form-control is-invalid");
      setEmailLabel("Email can not be empty");
    }
  };
  return (
    <div
      class="d-flex flex-column justify-content-start"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <main className="flex-shrink-0">
        <div class="row">
          <div className="mx-auto  col-10 col-md-8 col-lg-4 shadow p-3 mt-5 mb-2 bg-body rounded border">
            <div className="mb-4 mt-3 d-flex">
              <h3 className="border-bottom border-success border-5 p-2">
                Forget Password?
              </h3>
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

              <div className="d-flex justify-content-center">
                {/* <a href="/resetPassword" className="text-decoration-none"> */}
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="mx-5 my-3 btn btn-success btn-lg"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>

                {/* <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={handleSubmit}
              >
                Submit
              </button> */}

                {/* </a> */}
              </div>
            </form>
          </div>
          <div
            class="modal fade"
            id="Modal1"
            tabindex="-1"
            aria-labelledby="Modal1Label"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body text-success">
                  A password reset link has been sent to your email
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
