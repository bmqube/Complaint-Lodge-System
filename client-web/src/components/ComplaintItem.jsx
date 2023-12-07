import React from "react";
import Navbar from "./Navbar";

export default function ComplaintItem({ item, index }) {
  let names = "";
  item.ComplaintAgainsts.map((e, index) => {
    names += e.complaintAgainst.fullname;

    if (index < item.ComplaintAgainsts.length - 1) {
      names += ", ";
    }
  });
  return (
    <tr>
      <th scope="row">{index}</th>
      <td>{names}</td>
      <td>{item.reviewer.fullname}</td>
      <td>{item.status}</td>
      <td>
        {new Date(item.updatedAt).toLocaleString("en-GB", { hour12: false })}
      </td>
      <td>
        <a
          href={"/complaints/details/" + item.token}
          className="btn btn-secondary me-2"
        >
          View
        </a>
      </td>
    </tr>
  );
}
