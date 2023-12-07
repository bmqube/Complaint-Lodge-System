import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { baseUrl } from "../Link";
import { Modal } from "bootstrap";

export default function AllUsers() {
  let userToken = localStorage.getItem("userToken");
  let userSessionToken = localStorage.getItem("userSessionToken");
  const [currToken, setCurrToken] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function getData() {
      let response = await axios.get(baseUrl + "/admin/users/all", {
        headers: {
          userToken: userToken,
          userSessionToken: userSessionToken,
        },
      });

      setUsers(response.data.data.items);
    }

    getData();
  }, []);

  const handleDisable = () => {
    let modal = new Modal(document.getElementById("disableModal"));
    modal.show();
  };

  const hideModal = () => {
    let modal = new Modal(document.getElementById("disableModal"));
    modal.hide();
  };

  const disableUser = async () => {
    await axios.post(
      baseUrl + "/admin/user/disable",
      {
        userToken: currToken,
      },
      {
        headers: {
          userToken: userToken,
          userSessionToken: userSessionToken,
        },
      }
    );
    let modal = new Modal(document.getElementById("disableModal"));
    modal.hide();
  };

  return (
    <div
      class="row square flex-column justify-content-start"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <div className="container emp-profile mx-auto  col-10 col-md-8 col-lg-15 shadow p-3 mt-5 mb-2 bg-body rounded border">
        <div className="mb-4 mt-3 d-flex">
          <h3 className="border-bottom border-success border-5 p-2">
            All Users
          </h3>
        </div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">FullName</th>
              <th scope="col">NSU ID</th>
              <th scope="col">Email</th>
              <th scope="col">User Type</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((e) => (
              <tr>
                <td scope="col">{e.fullname}</td>
                <td scope="col">{e.nsuId}</td>
                <td scope="col">{e.email}</td>
                <td scope="col">{e.userType}</td>
                <td scope="col">
                  <button
                    className="btn btn-secondary"
                    onClick={(event) => {
                      setCurrToken(e.token);
                      handleDisable();
                    }}
                  >
                    Disable
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        class="modal fade"
        id="disableModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="disableModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="disableModalLabel">
                Disable User
              </h5>
              <button
                type="button"
                class="close"
                // data-dismiss="modal"
                aria-label="Close"
                onClick={(e) => {
                  hideModal();
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              Are you sure you want to disable this user?
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                // data-dismiss="modal"
                onClick={(e) => {
                  hideModal();
                }}
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-danger"
                onClick={(e) => {
                  disableUser();
                }}
              >
                Disable
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
