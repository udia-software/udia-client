import { persistStore, persistCombineReducers } from "redux-persist";
import { createBlacklistFilter } from "redux-persist-transform-filter";
import storage from "redux-persist/es/storage";
import { routerMiddleware } from "react-router-redux";
import { applyMiddleware, compose, createStore } from "redux";
import history from "../history";
import reducers from "./rootReducer";

// Don't auto store the user object or JWT. Used for server validation
const saveAndLoadSubsetFilter = createBlacklistFilter(
  "auth",
  ["authUser", "jwt"]
);
const config = {
  key: "root",
  transforms: [saveAndLoadSubsetFilter],
  storage
};

const reducer = persistCombineReducers(config, reducers);

export default function configureStore() {
  let middleware = applyMiddleware(routerMiddleware(history));

  if (process.env.NODE_ENV !== "production") {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === "function") {
      middleware = compose(middleware, devToolsExtension());
    }
  }

  const store = createStore(reducer, middleware);
  const persistor = persistStore(store);

  return { persistor, store };
}
