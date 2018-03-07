import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { PersistGate } from "redux-persist/es/integration/react";

import App from "Containers/App";
import { configureStore, history, initializeApolloClient } from "Modules";
import registerServiceWorker from "registerServiceWorker";

const { persistor, store } = configureStore();

function render(Component) {
  ReactDOM.render(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ApolloProvider client={initializeApolloClient()}>
          <ConnectedRouter history={history}>
            <Component />
          </ConnectedRouter>
        </ApolloProvider>
      </PersistGate>
    </Provider>,
    document.getElementById("root")
  );
}
render(App);
registerServiceWorker();
