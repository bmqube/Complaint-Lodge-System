import React from "react";
import { useNavigate } from "react-router-dom";
// import logo from "../Images/logo7.png";

export default function Navbar() {
  let navigate = useNavigate();
  let userToken = localStorage.getItem("userToken");
  let actorType = localStorage.getItem("actorType");
  let loggedInNavbar = [
    {
      title: "New Complain",
      link: "/complain/new",
      type: "button",
    },
    {
      title: "Profile",
      link: "/profile",
      type: "button",
    },
  ];

  let notLoggedInNavbar = [
    {
      title: "Login",
      link: "/login",
      type: "link",
    },
    {
      title: "Register",
      link: "/register",
      type: "link",
    },
  ];

  const signOut = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userSessionToken");
    navigate("/");
  };

  return (
    <div className="mb-4">
      {/* <nav className="navbar navbar-light" style="background-color: #e3f2fd;"> */}
      <nav class="navbar px-5 fixed-top navbar-expand-lg navbar-dark  bg-success text-white">
        <div class="container-fluid">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="20"
            fill="currentColor"
            class="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
          </svg>
          <a className="navbar-brand fw-bold" href="/">
            NSU-CLS
            {/* <img src={logo}></img> */}
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav ms-auto">
              {/* <a class="nav-link active" aria-current="page" href="/">
                Home
              </a> */}
              <div className="nav-item">
                <a class="nav-link" aria-current="page" href="#">
                  How to Complain
                </a>
              </div>
              {userToken == null
                ? notLoggedInNavbar.map((e) => (
                    <div className="nav-item">
                      <a className="nav-link" href={e.link}>
                        {e.title}
                      </a>
                    </div>
                  ))
                : loggedInNavbar.map(
                    (e) =>
                      e.title !== "Profile" ? (
                        <div className="nav-item">
                          <a className="nav-link" href={e.link}>
                            {e.title}
                          </a>
                        </div>
                      ) : (
                        <li class="nav-item dropdown">
                          <a
                            class="nav-link dropdown-toggle"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="23"
                              height="23"
                              fill="currentColor"
                              class="bi bi-person-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                          </a>
                          <ul
                            class="dropdown-menu dropdown-menu-end"
                            aria-labelledby="navbarDropdown"
                          >
                            <li>
                              <a class="dropdown-item" href="/profile">
                                My Profile
                              </a>
                            </li>
                            {actorType === "SysAdmin" ? (
                              <li>
                                <a class="dropdown-item" href="/user/all">
                                  All Users
                                </a>
                                <li>
                                  <a
                                    class="dropdown-item"
                                    href="/admin/create/account"
                                  >
                                    Add New User
                                  </a>
                                </li>
                              </li>
                            ) : (
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="/user/complaints"
                                >
                                  My Complaints
                                </a>
                              </li>
                            )}
                            {actorType === "Reviewer" ? (
                              <li>
                                <a
                                  class="dropdown-item"
                                  href="/review/complaints"
                                >
                                  Review Complaints
                                </a>
                              </li>
                            ) : (
                              ""
                            )}
                            <li>
                              <hr class="dropdown-divider" />
                            </li>
                            <li>
                              <a
                                onClick={signOut}
                                class="dropdown-item"
                                style={{ cursor: "pointer" }}
                              >
                                Sign Out
                              </a>
                            </li>
                          </ul>
                        </li>
                      )
                    // {e.title == "Profile" ? (
                    // <svg
                    //   xmlns="http://www.w3.org/2000/svg"
                    //   width="23"
                    //   height="23"
                    //   fill="currentColor"
                    //   class="bi bi-person-fill"
                    //   viewBox="0 0 16 16"
                    // >
                    //   <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    // </svg>

                    // ) : (
                    //   e.title
                    // )}
                  )}
            </div>
          </div>
        </div>
      </nav>
      {/* </nav> */}
    </div>
  );
}
