import "babel-polyfill";
import { default as React, Component } from "react";
import ReactDOM from "react-dom";
import ReactRoot from "./Components/ReactRoot";
import {} from "../styles/reset.css";
import {} from "../fonts/main.css";
import {} from "../styles/main.css";

ReactDOM.render(<ReactRoot />, document.getElementById("reactContainer"));
