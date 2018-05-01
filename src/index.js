// @flow
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { Provider, connect } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/es/integration/react";

import App from "./Containers/App";
import { ConfigureStore, InitializeApolloClient } from "./Modules";
import registerServiceWorker from "./registerServiceWorker";

type Props = {
  jwt: string
};

const rootElement = document.getElementById("root");
if (rootElement) {
  const { persistor, store } = ConfigureStore();

  /* Workaround for getting the Apollo client to referesh on login/logout */
  class RefreshingApolloProvider extends Component<Props> {
    shouldComponentUpdate(nextProps) {
      return this.props.jwt !== nextProps.jwt;
    }
    render() {
      console.log(
        `Rehydrated ApolloProvider ${
          this.props.jwt ? "(JWT Set!)" : "(No JWT)"
        }`
      );
      return (
        <ApolloProvider {...this.props} client={InitializeApolloClient()} />
      );
    }
  }

  const HydratedApolloProvider = connect(state => ({jwt: state.auth.jwt}))(
    RefreshingApolloProvider
  );

  const supportsHistory = "pushState" in window.history;

  function render(Component) {
    ReactDOM.render(
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <HydratedApolloProvider>
            <BrowserRouter forceRefresh={!supportsHistory}>
              <Component />
            </BrowserRouter>
          </HydratedApolloProvider>
        </PersistGate>
      </Provider>,
      rootElement
    );
  }
  render(App);
  registerServiceWorker();
} else {
  throw new Error("Element `root` does not exist!");
}
