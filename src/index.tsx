import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import App from "./Components/App";
import RefreshingApolloProvider from "./Components/Wrapper/RefreshingApolloProvider";
import ToggleableThemeProvider from "./Components/Wrapper/ToggleableThemeProvider";
import configureReduxStore from "./Modules/ConfigureReduxStore";
import registerServiceWorker from "./registerServiceWorker";

function render(
  AppComponent: any, // Renderer accepts a ton of stuff, just pass in whatever
  root: HTMLElement | null
) {
  if (!root) {
    throw new Error("Element `root` does not exist!");
  }
  const { persistor, store } = configureReduxStore();
  ReactDOM.render(
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <RefreshingApolloProvider>
          <ToggleableThemeProvider>
            <BrowserRouter>
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
  registerServiceWorker();
}

export default render;
