import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@popperjs/core";
import Register from "./components/Register";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import Search from "./components/Search";
import Home from "./components/Home";
import LodgeComplaint from "./components/LodgeComplaint";
import Profile from "./components/Profile";
import EmailVerification from "./components/EmailVerification";
import AllComplaints from "./components/AllComplaints";
import ComplaintItem from "./components/ComplaintItem";
import ComplaintDetails from "./components/ComplaintDetails";
import ReviewComplaints from "./components/ReviewComplaints";
import EditComplaint from "./components/EditComplaint";
import ChangeReviewer from "./components/ChangeReviewer";
import EditHistoryPage from "./components/EditHistoryPage";
import AllUsers from "./components/AllUsers";
import CreateAccountBySysAdmin from "./components/CreateAccountBySysAdmin";
ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register select={false} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Search />} />
        <Route path="/forget/password" element={<ForgetPassword />} />
        <Route path="/email/verify/:token" element={<EmailVerification />} />
        <Route path="/reset/password/:token" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/complain/new" element={<LodgeComplaint />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/complaints/" element={<AllComplaints />} />
        <Route path="/user/all" element={<AllUsers />} />
        <Route
          path="/review/complaints/"
          element={<ReviewComplaints />}
        />
        <Route
          path="/complaints/details/:token"
          element={<ComplaintDetails />}
        />
        <Route path="/complaint/edit/:token" element={<EditComplaint />} />

        <Route path="/change/reviewer/:token" element={<ChangeReviewer />} />
        <Route path="/view/edit-history/:token" element={<EditHistoryPage />} />
        <Route path="/admin/create/account" element={<CreateAccountBySysAdmin />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
