import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import "semantic-ui-css/semantic.min.css";
import { ApolloProvider } from "react-apollo";
import { ApolloLink, split } from "apollo-client-preset";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import App from "./components/App";
import history from "./history";
import configureStore from "./modules/configureStore";
import registerServiceWorker from "./registerServiceWorker";
import { GC_AUTH_TOKEN } from "./constants";

// Redux Store
const { persistor, store } = configureStore();

// Apollo Client
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || "__SIMPLE_API_ENDPOINT__"
});

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

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);
const wsLink = new WebSocketLink({
  uri:
    process.env.REACT_APP_SUBSCRIPTIONS_ENDPOINT ||
    "__SUBSCRIPTION_API_ENDPOINT__",
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(GC_AUTH_TOKEN)
    }
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLinkWithAuthToken
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

// DOM Element
const rootElement = document.getElementById("root");

function render(Component) {
  ReactDOM.render(
    <PersistGate persistor={persistor}>
      <ApolloProvider client={client}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Component />
          </ConnectedRouter>
        </Provider>
      </ApolloProvider>
    </PersistGate>,
    rootElement
  );
}
render(App);
registerServiceWorker();
