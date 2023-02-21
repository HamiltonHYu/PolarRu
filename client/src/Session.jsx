import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import * as ENV from "./env";

const Session = (props) => {
  const [loading, loadState] = useState(null);

  if (!loading) {
    console.log(ENV.API_URL + "/login");
    axios
      .get(ENV.API_URL + "/login", { withCredentials: true })
      .then((res) => {
        console.log(res);
        loadState(res.data);
      })
      .catch((err) => {
        console.log("Error in session request: ", err);
      });
  }

  if (!loading) return <h3>loading</h3>;

  let pollId;
  if (props.match.params.pollId) {
    pollId = props.match.params.pollId;
    if (loading.tabs === "/landing") loading.tabs = "/vote";
  }

  return (
    <Redirect
      to={{
        pathname: loading.tabs,
        state: { userId: loading.userId, pollId },
      }}
    />
  );
};

export default Session;
