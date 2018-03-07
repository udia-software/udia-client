import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { routerMiddleware } from "react-router-redux";
import { applyMiddleware, compose, createStore } from "redux";
import history from "./history";
import rootReducer from "./rootReducer";

export function configureStore() {
  const rootPersistConfig = {
    key: "root",
    storage: storage,
    blacklist: ["auth", "routing"]
  };

  const persistedReducer = persistCombineReducers(
    rootPersistConfig,
    rootReducer
  );

  let middleware = applyMiddleware(routerMiddleware(history));
  if (process.env.NODE_ENV !== "production") {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === "function") {
      middleware = compose(middleware, devToolsExtension());
    }
  }
  const store = createStore(persistedReducer, middleware);
  const persistor = persistStore(store);
  return { store, persistor };
}

export default configureStore;
