import localforage from "localforage";
import { createStore, StoreEnhancer } from "redux";
import {
  persistCombineReducers,
  PersistConfig,
  persistStore
} from "redux-persist";
import rootReducer from "./Reducers/RootReducer";

const storage = localforage.createInstance({ name: "UdiaPersistance" });

const rootPersistConfig: PersistConfig = {
  key: "root",
  storage,
  blacklist: ["auth"],
  whitelist: ["notes", "secrets", "theme"]
};

interface IDevToolsWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer | undefined;
}
declare var window: IDevToolsWindow;

export default function configureReduxStore() {
  const persistedReducer = persistCombineReducers(
    rootPersistConfig,
    rootReducer
  );
  const store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  const persistor = persistStore(store);
  return { store, persistor };
}
