import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { Provider, connect } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/es/integration/react";

import App from "Containers/App";
import { configureStore, initializeApolloClient } from "Modules";
import registerServiceWorker from "registerServiceWorker";

const { persistor, store } = configureStore();

/* Workaround for getting the Apollo client to referesh on login/logout */
class RefreshingApolloProvider extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.jwt !== nextProps.jwt;
  }
  render() {
    console.log(
      `Rehydrated ApolloProvider ${this.props.jwt ? "(JWT Set!)" : "(No JWT)"}`
    );
    return <ApolloProvider {...this.props} client={initializeApolloClient()} />;
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.auth.jwt
  };
}

const HydratedApolloProvider = connect(mapStateToProps)(
  RefreshingApolloProvider
);

const supportsHistory = 'pushState' in window.history;

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
    document.getElementById("root")
  );
}
render(App);
registerServiceWorker();
