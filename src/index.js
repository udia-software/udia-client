import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import {
  GC_AUTH_TOKEN,
  REACT_APP_GRAPHQL_HTTP_ENDPOINT,
  REACT_APP_SUBSCRIPTIONS_ENDPOINT
} from "./constants";

// Build the Apollo Http Link with the authentication token
const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(GC_AUTH_TOKEN);
  const authorizationHeader = token ? `${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  });
  return forward(operation);
});
const httpLinkWithAuthToken = middlewareAuthLink.concat(
  new HttpLink({
    uri: REACT_APP_GRAPHQL_HTTP_ENDPOINT
  })
);

// Build the Apollo Websocket Link with the authentication token
const wsLinkWithAuthToken = new WebSocketLink({
  uri: REACT_APP_SUBSCRIPTIONS_ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: {
      authorization: localStorage.getItem(GC_AUTH_TOKEN)
    }
  }
});

// Determine which link to use. If operation is subscription, use WebsocketLink
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLinkWithAuthToken,
  httpLinkWithAuthToken
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const supportsHistory = 'pushState' in window.history;

const rootElement = document.getElementById("root");
function render(Component) {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter forceRefresh={!supportsHistory}>
        <Component />
      </BrowserRouter>
    </ApolloProvider>,
    rootElement
  );
}
render(App);
registerServiceWorker();
