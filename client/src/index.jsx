import "regenerator-runtime/runtime";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

//const logo = "/assets/Pollr_Text_White.png";
const logo = "/assets/oie_OakRVG2UnYoK.jpg";

render(
  //<App socket={socket}/>,
  <BrowserRouter>
    <center>
      <img src={logo}></img>
    </center>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
