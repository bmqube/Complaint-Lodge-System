import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Gull from "../Images/green4_avatar.jpg";
import axios from "axios";
import { baseUrl } from "../Link";
// import "./Register.css";

export default function Profile() {
  const userToken = localStorage.getItem("userToken");
  let userSessionToken = localStorage.getItem("userSessionToken");
  const [fullname, setFullname] = useState("");
  const [nsuId, setNsuId] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      let response = await axios.get(baseUrl + "/user/profile", {
        headers: {
          userToken: userToken,
          userSessionToken: userSessionToken,
        },
      });
      if (response.data.responseCode === "SESSION_EXPIRED") {
        localStorage.clear();
        navigate("/");
      }
      console.log(response);
      setFullname(response.data.data.fullname);
      setNsuId(response.data.data.nsuId);
      setEmail(response.data.data.email);
      setUserType(response.data.data.userType);
    }
    getData();
  }, []);
  if (!userToken) {
    return <Navigate to="/" />;
  }
  return (
    <div
      class="row square flex-column justify-content-start"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <div className="container emp-profile mx-auto  col-10 col-md-8 col-lg-15 shadow p-3 mt-5 mb-2 bg-body rounded border">
        <form>
          <div className="row">
            <div className="col-md-4">
              <img
                className="border border-2 rounded-circle mb-4 me-5"
                src={Gull}
                width="200"
                height="200"
              ></img>
            </div>
            <div className="col-md-6">
              <div className="fs-6 mt-2">
                <h3>{fullname}</h3>
                <p className="text-muted">{userType}</p>
                <h6>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="19"
                    fill="currentColor"
                    class="bi bi-envelope"
                    viewBox="0 0 20 19"
                  >
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                  </svg>
                  {email}
                </h6>
              </div>
            </div>
            {/* <div className="mt-4">
              <h3>My Complaints</h3>
            </div> */}
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
