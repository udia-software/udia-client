import { routerMiddleware } from "react-router-redux";
import { applyMiddleware, compose, createStore } from "redux";
import history from "../history";
import reducers from "./rootReducer";

export default function configureStore() {
  let middleware = applyMiddleware(routerMiddleware(history));

  if (process.env.NODE_ENV !== "production") {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === "function") {
      middleware = compose(middleware, devToolsExtension());
    }
  }

  const store = createStore(reducers, middleware);

  if (module.hot) {
    module.hot.accept("./rootReducer", () => {
      store.replaceReducer(require("./rootReducer").default);
    });
  }

  return store;
}
