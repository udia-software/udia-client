import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import "semantic-ui-css/semantic.min.css";

import App from "./components/App";
import history from "./history";
import configureStore from "./modules/configureStore";
import registerServiceWorker from "./registerServiceWorker";

const store = configureStore();
const rootElement = document.getElementById("root");

function render(Component) {
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Component />
      </ConnectedRouter>
    </Provider>,
    rootElement
  );
}
render(App);
registerServiceWorker();
