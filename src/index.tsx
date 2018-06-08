import React from "react";
import { ApolloProvider } from "react-apollo";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import App from "./Components/App";
import configureReduxStore from "./Modules/ConfigureReduxStore";
import initApolloClient from "./Modules/InitApolloClient";
import registerServiceWorker from "./registerServiceWorker";

function render(AppComponent: (() => JSX.Element), root: HTMLElement | null) {
  if (!root) {
    throw new Error("Element `root` does not exist!");
  }
  const { persistor, store } = configureReduxStore();
  ReactDOM.render(
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <ApolloProvider client={initApolloClient()}>
          <BrowserRouter>
            <AppComponent />
          </BrowserRouter>
        </ApolloProvider>
      </PersistGate>
    </ReduxProvider>,
    root
  );
}

if (process.env.NODE_ENV !== "test") {
  render(App, document.getElementById("root"));
  registerServiceWorker();
}

export default render;
