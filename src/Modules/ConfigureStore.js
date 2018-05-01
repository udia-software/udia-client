// @flow
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createStore } from "redux";
import RootReducer from "./RootReducer";

export function ConfigureStore() {
  const rootPersistConfig = {
    key: "root",
    storage: storage,
    blacklist: ["auth"]
  };

  const persistedReducer = persistCombineReducers(
    rootPersistConfig,
    RootReducer
  );

  const store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  const persistor = persistStore(store);
  return { store, persistor };
}
