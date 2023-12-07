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
  Autocomplete,
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
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Footer from "./Footer";
import { Modal } from "bootstrap";

export default function EditComplaint() {
  const [listOfGuilty, setListOfGuilty] = useState([]);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [oldFiles, setOldFiles] = useState([]);
  const [complaintMessage, setComplaintMessage] = useState("");
  const [complaintMessageLabel, setComplaintMessageLabel] = useState("Message");
  const [searchValue, setSearchValue] = useState("");

  const [modalCode, setModalCode] = useState(true);
  const [responseMessage, setResponseMessage] = useState("");
  const userToken = localStorage.getItem("userToken");
  let userSessionToken = localStorage.getItem("userSessionToken");

  let navigate = useNavigate();
  let { token } = useParams();

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  const deleteFile = (index, id) => {
    console.log(index);
    if (id) {
      if (index < files.length) {
        setFiles(files.filter((e, i) => i !== index));
      }
    } else {
      if (index < oldFiles.length) {
        setOldFiles(oldFiles.filter((e, i) => i !== index));
      }
    }
  };

  useEffect(() => {
    async function getData() {
      let response = await axios.get(baseUrl + "/complaint/details/" + token, {
        headers: {
          userToken: userToken,
          userSessionToken: userSessionToken,
        },
      });
      console.log(response);
      if (response.data.responseCode === "LIST_LOADED") {
        let data = response.data.data;
        console.log(data);
        setComplaintMessage(data.description);
        setListOfGuilty(data.ComplaintAgainsts.map((e) => e.complaintAgainst));
        setOldFiles(data.ComplaintEvidences);
      }
      if (response.data.responseCode === "SESSION_EXPIRED") {
        localStorage.clear();
        navigate("/");
      }
    }

    getData();
  }, []);

  const handleSubmit = async (event) => {
    // console.log(listOfGuilty);
    let body = new FormData();
    body.append("complaintToken", token);
    body.append("complaintAgainstList", JSON.stringify(listOfGuilty));
    body.append("message", complaintMessage);
    body.append("oldFiles", JSON.stringify(oldFiles));
    for (let i = 0; i < files.length; i++) {
      const curr_file = files[i];
      body.append("evidence", curr_file);
    }

    let response = await axios.put(baseUrl + "/complaint/edit/user", body, {
      headers: {
        userToken: userToken,
        userSessionToken: userSessionToken,
      },
    });

    console.log(response.data);

    if (response.data.responseCode === "INSERTION_SUCCESSFUL") {
      setListOfGuilty([]);
      setModalCode(true);
    } else {
      setModalCode(false);
    }
    setResponseMessage(response.data.message);
    let modal = new Modal(document.getElementById("successModal"));
    modal.show();
    setTimeout(() => {
      navigate("/user/complaints");
      modal.hide();
    }, 1000);
  };

  useEffect(() => {
    if (searchValue) {
      async function getSearchedValue() {
        let response = await axios.post(
          baseUrl + "/complaint/search/all",
          {
            keyword: searchValue,
          },
          {
            headers: {
              userToken: userToken,
              userSessionToken: userSessionToken,
            },
          }
        );

        let tempListOfUsers = response.data.data.items;
        // console.log(response);
        setListOfUsers(tempListOfUsers);
      }
      getSearchedValue();
    } else {
      setListOfUsers([]);
    }
  }, [searchValue]);

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

  const handleChange = (event, newValue) => {
    setListOfGuilty(newValue);
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
            Update Complaint
          </h1>
        </div>

        <Autocomplete
          multiple={true}
          key={true}
          filterOptions={(x) => x}
          // sx={props.sx}
          //   value={listOfGuilty}
          options={listOfUsers}
          isOptionEqualToValue={(option, value) => option.token === value.token}
          getOptionLabel={(listOfUsers) =>
            `${listOfUsers.fullname} (${listOfUsers.nsuId})`
          }
          onInputChange={(elem) => setSearchValue(elem.target.value)}
          onChange={handleChange}
          value={listOfGuilty}
          renderInput={(params) => (
            <TextField {...params} label="Choose Complainee" />
          )}
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
          {oldFiles.map((e, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  onClick={(e) => {
                    deleteFile(index, 0);
                  }}
                  edge="end"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={e.originalFileName} />
            </ListItem>
          ))}
        </List>

        <List>
          {files.map((e, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  onClick={(e) => {
                    deleteFile(index, 1);
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
            Update Complaint
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
