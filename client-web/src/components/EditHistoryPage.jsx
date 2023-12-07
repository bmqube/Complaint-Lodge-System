import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../Link";
import EditHistoryCurrentItem from "./EditHistoryCurrentItem";
import EditHistoryItem from "./EditHistoryItem";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function EditHistoryPage() {
  let { token } = useParams();
  let userToken = localStorage.getItem("userToken");
  let userSessionToken = localStorage.getItem("userSessionToken");
  const [list, setList] = useState([]);
  const [currObject, setCurrObject] = useState({});

  useEffect(() => {
    async function getData() {
      let current_complaint = await axios.get(
        baseUrl + "/complaint/details/" + token,
        {
          headers: {
            userToken: userToken,
            userSessionToken: userSessionToken,
          },
        }
      );
      let response = await axios.get(
        baseUrl + "/complaint/edit/history/" + token,
        {
          headers: {
            userToken: userToken,
            userSessionToken: userSessionToken,
          },
        }
      );

      setCurrObject(current_complaint.data.data);
      //   console.log(current_complaint.data.data);
      setList(response.data.data.items);
    }

    getData();
  }, []);

  return (
    <div
      class="d-flex flex-column justify-content-start"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />
      <div className="mx-auto col-10 col-md-9 col-lg-8 shadow p-3 my-5 bg-body rounded border">
        <div className="mb-4 mt-3 d-flex">
          <h3 className="border-bottom border-success border-5 p-2">
            Edit History
          </h3>
        </div>
        <EditHistoryCurrentItem complaint={currObject} />
        {list.map((e) => (
          <EditHistoryItem complaint={e} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
