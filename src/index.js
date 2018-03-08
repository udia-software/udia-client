import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { Provider, connect } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { PersistGate } from "redux-persist/es/integration/react";

import App from "Containers/App";
import { configureStore, history, initializeApolloClient } from "Modules";
import registerServiceWorker from "registerServiceWorker";

const { persistor, store } = configureStore();

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

function render(Component) {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <HydratedApolloProvider>
          <ConnectedRouter history={history}>
            <Component />
          </ConnectedRouter>
        </HydratedApolloProvider>
      </PersistGate>
    </Provider>,
    document.getElementById("root")
  );
}
render(App);
registerServiceWorker();
