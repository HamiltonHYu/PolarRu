const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require ('cors');

const WSServer = require('./websocket.js');
const connections = require('./routers/pollWebsocket.js');
const SocketIo = require("./io");

const {
  cookieController,
  userController,
  sessionController,
} = require('./controllers');


const {MONGO_URI, MONGO_TEST_URI, NODE_ENV} = require("./env");
const PORT = 3001;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "..'client/dist")));

app.get('/login', sessionsController.isLoggedIn, (req, res) => {
  if (res.locals.isLoggedIn) {
    res.status(200).json({ tabs: "/landing", userId: res.locals.userId});
  } else  res.status(200).json({tabs: "/login"});
});

app.post(
  "/signup",
  userController.createUser,
  cookieController.createCookie,
  sessionController.createSession,
  (req, res) => {
    console.log("end of signup route");
    res.status(200).json({tabs: "/landing", userId: res.locals.userId});
  }
);

app.post(
  "/login",
  userController.verifyUser,
  cookieController.createCookie,
  sessionController.createSession,
  (req, res) => {
    if (res.locals.verified) {
      res.status(200).json({tabs: "/landing",
    userId: res.locals.userId});
    } else {
      res.status(200).json({ tabs: "/logout"});
    }
  }
);
