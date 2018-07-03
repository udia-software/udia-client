import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
// tslint:disable-next-line:no-submodule-imports
import { PersistGate } from "redux-persist/integration/react";
import App from "./Components/App";
import RefreshingApolloProvider from "./Components/Wrapper/RefreshingApolloProvider";
import ToggleableThemeProvider from "./Components/Wrapper/ToggleableThemeProvider";
import configureReduxStore from "./Modules/ConfigureReduxStore";
import register from "./registerServiceWorker";

function render(
  AppComponent: () => JSX.Element,
  root: HTMLElement | null
) {
  if (!root) {
    throw new Error("Element `root` does not exist!");
  }
  const supportsHistory = 'pushState' in window.history;
  const { persistor, store } = configureReduxStore();
  ReactDOM.render(
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <RefreshingApolloProvider>
          <ToggleableThemeProvider>
            <BrowserRouter forceRefresh={!supportsHistory}>
              <AppComponent />
            </BrowserRouter>
          </ToggleableThemeProvider>
        </RefreshingApolloProvider>
      </PersistGate>
    </ReduxProvider>,
    root
  );
}

if (process.env.NODE_ENV !== "test") {
  render(App, document.getElementById("root"));
  register();
  // unregister();
}

export default render;
