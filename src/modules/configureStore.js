import { routerMiddleware } from "react-router-redux";
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import history from "../history";
import reducers from "./rootReducer";
import sagas from "./rootSaga";

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  let middleware = applyMiddleware(sagaMiddleware, routerMiddleware(history));

  if (process.env.NODE_ENV !== "production") {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === "function") {
      middleware = compose(middleware, devToolsExtension());
    }
  }

  const store = createStore(reducers, middleware);
  sagaMiddleware.run(sagas);

  if (module.hot) {
    module.hot.accept("./rootReducer", () => {
      store.replaceReducer(require("./rootReducer").default);
    });
  }

  return store;
}
