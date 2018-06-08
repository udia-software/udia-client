import React from "react";
import { ApolloProvider } from "react-apollo";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./Components/App";
import initApolloClient from "./Modules/InitApolloClient";
import registerServiceWorker from "./registerServiceWorker";

function render(AppComponent: (() => JSX.Element), root: HTMLElement | null) {
  if (!root) {
    throw new Error("Element `root` does not exist!");
  }

  ReactDOM.render(
    <ApolloProvider client={initApolloClient()}>
      <BrowserRouter>
        <AppComponent />
      </BrowserRouter>
    </ApolloProvider>,
    root
  );
}

if (process.env.NODE_ENV !== "test") {
  render(App, document.getElementById("root"));
  registerServiceWorker();
}

export default render;
