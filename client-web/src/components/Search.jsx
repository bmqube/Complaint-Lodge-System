import axios from "axios";
import React, { useState, useEffect } from "react";
import { baseUrl } from "../Link";

export default function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [listOfUsers, setListOfUsers] = useState([]);
  useEffect(() => {
    if (searchValue) {
      async function fetchData() {
        let response = await axios.get(
          baseUrl + "/complaint/search/" + searchValue
        );
        console.log(listOfUsers);
        setListOfUsers(response.data.data.items);
      }
      fetchData();
    }
  }, [searchValue]);

  return (
    <form>
      <div className="mb-3 form-floating">
        <input
          type="text"
          readonly
          autoComplete={listOfUsers}
          className="form-control"
          id="searchBox"
          placeholder="Enter Your Query"
          value={searchValue}
          onChange={(ele) => {
            setSearchValue(ele.target.value);
          }}
        />
        <label for="searchBox">Search Query</label>
      </div>
    </form>
  );
}
