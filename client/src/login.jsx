import React from "react";
import { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import { useHistory } from "react-router-dom";
// import GuestLogIn from "./guestlogin.jsx";
import * as ENV from "./env";
import { makeStyles } from "@material-ui/core";
/*
Login page allows user to log in, or allows them to
navigate to the sign up page
*/

const useStyles = makeStyles({
  btn: {
    fontSize: 20,
    // display: flex,
    // align-items: center
    // justifyContent: 'left',
    backgroundColor: "white",
    // margin: auto,
    // padding:10
    marginLeft: 25,
  },
});

export default function Login(props) {
  const classes = useStyles();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(null);
  const history = useHistory();

  // form validation; username and password need to be > one char
  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  const signUp = () => {
    // fetch request to the server on the 'signup' route, method is post

    fetch(ENV.API_URL + "/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("new user signed up: ", data);
        props.updateUser(data.userId);
        history.push("/landing");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const login = () => {
    // fetch request to the server on the 'login' route, method is post
    fetch(ENV.API_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    })
      .then((response) => {
        if (response.status != 200) {
          throw Error();
        }
        return response.json();
      })
      .then((data) => {
        //if(data.noUser) return signUp();
        props.updateUser(data.userId);
        history.push(`/landing`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <form className="loginPage">
        <h1>{isLogin ? "Log in" : "Sign up"}</h1>
        <Box m={2}>
          <div>
            <TextField
              onSubmit={handleSubmit}
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              label="username"
              variant="outlined"
            />
          </div>
        </Box>
        <Box m={2}>
          <div>
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="password"
              variant="outlined"
            />
          </div>
        </Box>
        <div>
          <div>
            <Button
              className={classes.btn}
              onClick={() => {
                if (validateForm()) {
                  if (isLogin) {
                    return login();
                  }
                  return signUp();
                }
                return;
              }}
              // disabled={!validateForm()}
              variant="contained"
            >
              {isLogin ? "Log in" : "Sign up"}
            </Button>
          </div>
          <div>
            <p
              style={{ cursor: "pointer" }}
              onClick={() => setIsLogin(!isLogin)}
              // disabled={!validateForm()}
              variant="contained"
            >
              {" "}
              <u>
                {isLogin ? "Create an account" : "Already have an account?"}
              </u>
            </p>
          </div>
        </div>
      </form>
      {/* {props.location.state.pollId && <GuestLogIn {...props} />} */}
    </div>
  );
}
