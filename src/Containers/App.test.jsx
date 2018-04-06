import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import App from "Containers/App";
import { configureStore } from "Modules";
import { REACT_APP_GRAPHQL_HTTP_ENDPOINT } from "Constants";

it("renders without crashing", async done => {
  const div = document.createElement("div");
  const { store } = configureStore();
  ReactDOM.render(
    <Provider store={store}>
      <ApolloProvider
        client={
          new ApolloClient({
            link: new HttpLink({ uri: REACT_APP_GRAPHQL_HTTP_ENDPOINT }),
            cache: new InMemoryCache()
          })
        }
      >
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </ApolloProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
  // this is required because otherwise JSDOM throws an exception
  // https://github.com/jsdom/jsdom/issues/1798
  // likely related to Apollo
  await new Promise(resolve => setTimeout(resolve, 20));
  done();
});
