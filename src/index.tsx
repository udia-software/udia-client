import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./Components/App";
import registerServiceWorker from "./registerServiceWorker";

function render(AppComponent: (() => JSX.Element), root: HTMLElement | null) {
  if (!root) {
    throw new Error("Element `root` does not exist!");
  }

  ReactDOM.render(
    <BrowserRouter>
      <AppComponent />
    </BrowserRouter>,
    root
  );
}

if (process.env.NODE_ENV !== "test") {
  render(App, document.getElementById("root"));
  registerServiceWorker();
}

export default render;
