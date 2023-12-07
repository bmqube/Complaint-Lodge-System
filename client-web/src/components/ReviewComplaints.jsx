import React from "react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { baseUrl } from "../Link";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ComplaintItem from "./ComplaintItem";
import Footer from "./Footer";

export default function ReviewComplaints() {
  const userToken = localStorage.getItem("userToken");
  const userSessionToken = localStorage.getItem("userSessionToken");
  const [list, setList] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      let response = await axios.get(baseUrl + "/user/review/all", {
        headers: {
          userToken: userToken,
          userSessionToken: userSessionToken,
        },
      });
      console.log(response);
      if (response.data.data.items) {
        setList(response.data.data.items);
      }
      if (response.data.responseCode === "SESSION_EXPIRED") {
        localStorage.clear();
        navigate("/");
      }
    }

    getData();
  }, []);

  return (
    <div
      class="row square flex-column justify-content-start"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <div className="container emp-profile mx-auto  col-10 col-md-8 col-lg-15 shadow p-3 mt-5 mb-2 bg-body rounded border">
        <div className="mb-4 mt-3 d-flex">
          <h3 className="border-bottom border-success border-5 p-2">
            Review Complaints
          </h3>
        </div>
        {list.length > 0 ? (
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Complainee</th>
                <th scope="col">Reviewer</th>
                <th scope="col">Status</th>
                <th scope="col">Last Updated</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e, index) => (
                <ComplaintItem item={e} index={index + 1} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="d-flex justify-content-center display-6 my-5">
            No complaints to show
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
