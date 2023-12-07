import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faGooglePlus,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { baseUrl } from "../Link";

function Footer() {
  return (
    <footer className="footer mt-auto py-5 bg-success">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3 col-12">
            <a
              className="d-inline-flex align-items-center mb-2 link-dark text-decoration-none"
              href="/"
              aria-label="Bootstrap"
            >
              <title>NSU-CLS</title>

              <span className="fs-5 text-white">NSU-CLS</span>
            </a>
            <ul className="list-unstyled small text-white">
              <li className="mb-2">Bashundhara, Dhaka-1229, Bangladesh</li>
              <li className="mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="14"
                  fill="currentColor"
                  class="bi bi-telephone"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
                </svg>
                +880-2-55668200 | Fax: +880-2-55668202
              </li>
              <li className="mb-2">registrar@northsouth.edu .</li>
            </ul>
          </div>

          <div className="ms-auto col-12 col-md-6 mb-3">
            <ul className="list-unstyled d-flex">
              <li className="mb-2">
                <a
                  className="fa-lg "
                  style={{
                    color: "#1E1EFF",
                    textDecoration: "none",
                  }}
                  href="https://www.facebook.com/NorthSouthUniversity"
                >
                  <i className="me-2 btn btn-success border border-white">
                    <FontAwesomeIcon icon={faFacebook} />
                  </i>
                </a>
              </li>
              <li className="mb-2">
                <a
                  className="fa-lg"
                  style={{ color: "#ac2bac", textDecoration: "none" }}
                  href="https://www.instagram.com/NorthSouthUniversity/"
                >
                  <i
                    className="me-2 btn btn-success border border-white"
                    style={{
                      backgroundcolor: "#ac2bac",
                      textDecoration: "none",
                    }}
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </i>
                </a>
              </li>
              <li className="mb-2">
                <a
                  className="fa-lg"
                  style={{ color: "##55acee", textDecoration: "none" }}
                  href="https://twitter.com/NorthSouthU"
                >
                  <i
                    className="me-2 btn btn-success border border-white"
                    style={{
                      backgroundcolor: "##55acee",
                      textDecoration: "none",
                    }}
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </i>
                </a>
              </li>
              <li className="mb-2">
                <a
                  className="fa-lg"
                  style={{ color: "#EB0B0B", textDecoration: "none" }}
                  href="https://www.youtube.com/NorthSouthUniversity"
                >
                  <i
                    className="me-2 btn btn-success border border-white"
                    style={{
                      bckgroundcolor: "#EB0B0B",
                      textDecoration: "none",
                    }}
                  >
                    <FontAwesomeIcon icon={faYoutube} />
                  </i>
                </a>
              </li>
              <li className="mb-2">
                <a
                  className="fa-lg"
                  style={{ color: "#55acee", textDecoration: "none" }}
                  href="https://currents.google.com/admindisabled"
                >
                  <i
                    className="me-2 btn btn-success border border-white"
                    style={{
                      backgroundcolor: "#55acee",
                      textDecoration: "none",
                    }}
                  >
                    <FontAwesomeIcon icon={faGooglePlus} />
                  </i>
                </a>
              </li>
            </ul>
            <ul className="list-unstyled small text-white">
              <li className="mb-2">
                Developed & Maintained by MeowIT Office, NSU
              </li>
              <li className="mb-2">
                © 1993-2022 North South University. All rights reserved.{" "}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
