import localforage from "localforage";
import { createStore, StoreEnhancer } from "redux";
import { persistCombineReducers, persistStore } from "redux-persist";
import rootReducer from "./Reducers/RootReducer";

const persistConfig = {
  key: "root",
  storage: localforage.createInstance({ name: "UdiaPersistance" })
};

interface IDevToolsWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer | undefined;
}
declare var window: IDevToolsWindow;

export default function configureReduxStore() {
  const persistedReducer = persistCombineReducers(persistConfig, rootReducer);
  const store = createStore(
    persistedReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  const persistor = persistStore(store);
  return { store, persistor };
}
