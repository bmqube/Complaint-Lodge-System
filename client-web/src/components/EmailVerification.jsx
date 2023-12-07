import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../Link";
import Footer from "./Footer";
import Navbar from "./Navbar";

function EmailVerification() {
  const { token } = useParams();
  const [status, setStatus] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyData() {
      let response = await axios.get(baseUrl + "/auth/verify/email/" + token);
      setMessage(response.data.message);
      if (response.data.responseCode === "INSERTION_SUCCESSFUL") {
        setStatus(true);
      } else {
        setStatus(false);
      }
    }

    verifyData();
  }, []);

  return (
    <div>
      <Navbar />
      {status ? (
        <div class="row">
          <div className="mx-auto col-10 col-md-8 col-lg-4 shadow p-3 mt-5 mb-2 bg-body rounded border">
            <div className="mb-4 mt-3 d-flex justify-content-center">
              <form>
                <div className="fs-4 mx-auto text-success mb-3 d-flex justify-content-center">
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
                <div className="text-success fs-4">{message}</div>
              </form>
            </div>
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
                <div className="text-success fs-4">{message}</div>
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default EmailVerification;
