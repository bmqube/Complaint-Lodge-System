import { Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { baseUrl } from "../Link";

export default function SearchBar(props) {
  const [searchValue, setSearchValue] = useState("");
  const [listOfUsers, setListOfUsers] = useState([]);
  const [listOfGuilty, setListOfGuilty] = useState([]);
  const userToken = localStorage.getItem("userToken");
  let userSessionToken = localStorage.getItem("userSessionToken");

  useEffect(() => {
    if (searchValue) {
      async function getSearchedValue() {
        let response = await axios.post(
          baseUrl + "/complaint/search/" + props.searchFor,
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

  const handleChange = (event, newValue) => {
    setListOfGuilty(newValue);
    props.set(newValue);
  };
  return (
    <Autocomplete
      multiple={props.multiple}
      key={props.multiple}
      filterOptions={(x) => x}
      sx={props.sx}
      //   value={listOfGuilty}
      options={listOfUsers}
      isOptionEqualToValue={(option, value) => option.token === value.token}
      getOptionLabel={(listOfUsers) =>
        `${listOfUsers.fullname} (${listOfUsers.nsuId})`
      }
      onInputChange={(elem) => setSearchValue(elem.target.value)}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} label={props.label} />}
    />
  );
}
