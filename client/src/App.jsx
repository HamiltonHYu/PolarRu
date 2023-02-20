import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import Login from "./login.jsx";
import Landing from "./landing.jsx";
import Vote from "./Vote.jsx";
// import Session from "./Session.jsx";
import ChatBox from "./Chatbox.jsx";
import axios from "axios";
import * as ENV from "./env";

import "./style.css";

export default function App() {
  const [userId, setUserId] = useState(null);
  const history = useHistory();
  const location = useLocation();
  // switch tag to determine which page to load
  useEffect(() => {
    axios
      .get(ENV.API_URL + "/login", { withCredentials: true })
      .then((res) => {
        if (res.data.userId) {
          console.log(res.data.userId);
          setUserId(res.data.userId);
          if (location.pathname === "/") {
            history.push("/landing");
          }
        } else {
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log("Error in session request: ", err);
      });
  }, []);

  return (
    <main id="app">
      <Switch>
        <Route path="/test" render={(props) => <ChatBox {...props} />} exact />
        {/* <Route path="/" render={(props) => <Session {...props} />} exact /> */}
        <Route
          path="/login"
          render={(props) => (
            <Login {...props} updateUser={(id) => setUserId(id)} />
          )}
          exact
        />
        <Route
          path="/landing"
          render={(props) => (
            <Landing
              {...props}
              updateUser={(id) => setUserId(id)}
              userId={userId}
            />
          )}
          exact
        />
        {/* <Route
          path="/vote"
          render={(props) => (
            <div>
              <Vote {...props}  />
            </div>
          )}
          exact
        /> */}
        <Route
          path="/poll/:pollId"
          render={(props) => (
            <div>
              <Vote {...props} userId={userId} />{" "}
              {/* <ChatBox pollId={props.match.params.pollId} /> */}
            </div>
          )}
          exact
        />
      </Switch>
    </main>
  );
}
