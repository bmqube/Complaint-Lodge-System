import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  ListItemText,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { baseUrl } from "../Link";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Navbar from "./Navbar";
import SearchBar from "./SearchBar";
import { padding } from "@mui/system";
import { green } from "@mui/material/colors";
import { Navigate, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { Modal } from "bootstrap";

export default function LodgeComplaint() {
  const [listOfGuilty, setListOfGuilty] = useState([]);
  const [representative, setRepresentative] = useState({});
  const [reviewer, setReviewer] = useState({});
  const [files, setFiles] = useState([]);
  const [complaintMessage, setComplaintMessage] = useState("");
  const [complaintMessageLabel, setComplaintMessageLabel] = useState("Message");
  const [modalCode, setModalCode] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");

  const userToken = localStorage.getItem("userToken");
  let userSessionToken = localStorage.getItem("userSessionToken");
  let actorType = localStorage.getItem("actorType");

  let navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  const deleteFile = (index) => {
    console.log(index);
    if (index < files.length) {
      setFiles(files.filter((e, i) => i !== index));
    }
  };

  const theme = createTheme({
    status: {
      success: green[500],
    },
  });

  const handleSubmit = async (event) => {
    if (actorType === "SysAdmin") {
      let body = new FormData();
      body.append("representative", JSON.stringify(representative));
      body.append("complaintAgainstList", JSON.stringify(listOfGuilty));
      body.append("reviewer", JSON.stringify(reviewer));
      body.append("message", complaintMessage);
      for (let i = 0; i < files.length; i++) {
        const curr_file = files[i];
        body.append("evidence", curr_file);
      }

      let response = await axios.post(
        baseUrl + "/admin/lodge/complaint",
        body,
        {
          headers: {
            userToken: userToken,
            userSessionToken: userSessionToken,
          },
        }
      );
      if (response.data.responseCode === "INSERTION_SUCCESSFUL") {
        setRepresentative({});
        setListOfGuilty([]);
        setReviewer({});
        setModalCode(true);
      } else {
        setModalCode(false);
      }
      if (response.data.responseCode === "SESSION_EXPIRED") {
        localStorage.clear();
        navigate("/");
      }
      setResponseMessage(response.data.message);
    } else {
      let body = new FormData();
      body.append("complaintAgainstList", JSON.stringify(listOfGuilty));
      body.append("reviewer", JSON.stringify(reviewer));
      body.append("message", complaintMessage);
      for (let i = 0; i < files.length; i++) {
        const curr_file = files[i];
        body.append("evidence", curr_file);
      }

      let response = await axios.post(baseUrl + "/complaint/new", body, {
        headers: {
          userToken: userToken,
          userSessionToken: userSessionToken,
        },
      });
      if (response.data.responseCode === "INSERTION_SUCCESSFUL") {
        setListOfGuilty([]);
        setReviewer({});
        setModalCode(true);
      } else {
        setModalCode(false);
      }
      if (response.data.responseCode === "SESSION_EXPIRED") {
        localStorage.clear();
        navigate("/");
      }
      setResponseMessage(response.data.message);
    }

    let modal = new Modal(document.getElementById("successModal"));
    modal.show();

    setTimeout(() => {
      if (actorType === "SysAdmin") {
        navigate("/");
      } else {
        navigate("/user/complaints");
      }
      modal.hide();
    }, 1000);
  };

  if (!userToken) {
    return <Navigate to="/login" />;
  }
  const handleMessage = (val) => {
    if (val.length > 700) {
      setComplaintMessageLabel("Message cannot be more than 700 letters");
    } else {
      setComplaintMessage(val);
      setComplaintMessageLabel("Message");
    }
  };
  return (
    <div
      class="d-flex flex-column justify-content-start"
      style={{ minHeight: "100vh" }}
    >
      <Navbar />

      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "white",
          mt: "5rem",
          mb: "4rem",
          pt: "3rem",
          pb: "2rem",
          borderRadius: "0.5rem",
          boxShadow: 3,
        }}
      >
        <div className="mb-4 mt-3 d-flex">
          <h1 className="border-bottom border-success border-5 p-2">
            {" "}
            Lodge Complaint
          </h1>
        </div>
        {actorType === "SysAdmin" ? (
          <SearchBar
            label="As a Representative Of"
            set={setRepresentative}
            multiple={false}
            searchFor="all"
            sx={{ mb: "1rem" }}
          />
        ) : (
          ""
        )}
        <SearchBar
          label="Complain Against"
          set={setListOfGuilty}
          multiple={true}
          searchFor="all"
          // sx={{ mt: "5rem" }}
        />
        <SearchBar
          label="Choose Reviewer"
          set={setReviewer}
          multiple={false}
          sx={{ mt: "1rem" }}
          searchFor="reviewer"
        />
        <TextField
          value={complaintMessage}
          onInput={(e) => handleMessage(e.target.value)}
          multiline
          fullWidth
          sx={{ mt: "1rem" }}
          label={complaintMessageLabel}
          minRows={5}
          variant="outlined"
        />

        <List>
          {files.map((e, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  onClick={(e) => {
                    deleteFile(index);
                  }}
                  edge="end"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={e.name} />
            </ListItem>
          ))}
        </List>

        <label htmlFor="raised-button-file" style={{ display: "block" }}>
          <input
            accept="*"
            style={{ display: "none" }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <Button
            startIcon={<AttachFileIcon />}
            variant="outlined"
            component="span"
            sx={{ mt: "1rem" }}
          >
            Upload Evidence
          </Button>
        </label>

        {/* <Button
          variant="contained"
          color="success"
          sx={{ mt: "1rem" }}
          onClick={handleSubmit}
        >
          Lodge Complain
        </Button> */}
        <div className="d-grid gap-2">
          <button
            type="button"
            className="my-3 btn btn-success btn-lg"
            onClick={handleSubmit}
          >
            Lodge Complain
          </button>
        </div>
      </Container>
      <div
        class="modal fade"
        id="successModal"
        tabindex="-1"
        aria-labelledby="successModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body d-flex pb-4 fs-5 flex-column justify-content-center align-items-center text-success">
              <div className="min-vh-25">
                {modalCode ? (
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
                ) : (
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
                )}
              </div>
              <br />
              {responseMessage}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
