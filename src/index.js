import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";

import App from "Containers/App";
import registerServiceWorker from "registerServiceWorker";
import initializeApolloClient from "initializeApolloClient";

const supportsHistory = 'pushState' in window.history;

function render(Component) {
  ReactDOM.render(
    <ApolloProvider client={initializeApolloClient()}>
      <BrowserRouter forceRefresh={!supportsHistory}>
        <Component />
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById("root")
  );
}
render(App);
registerServiceWorker();
