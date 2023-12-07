import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

export default function Home() {
  let navigate = useNavigate();
  const handleSubmit = () => {
    let path = "/complain/new";
    navigate(path);
  };
  return (
    <div
      class="d-flex flex-column justify-content-start"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <main className="flex-shrink-0">
        <div className="mt-4 text-center fs-1">
          <br></br>
          <p className="mt-5">Need to resolve an issue?</p>
          <p>Let's get this sorted.</p>
          <div className="mt-4 text-success  text-center">
            <h3>Who is your issue with?</h3>
          </div>
        </div>
        <div className="mt-3 d-flex justify-content-center">
          <button
            type="button"
            className="my-4 btn btn-success btn-lg"
            onClick={handleSubmit}
          >
            Lodge a Compaint
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
