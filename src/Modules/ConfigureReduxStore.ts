import localforage from "localforage";
import { combineReducers, createStore, StoreEnhancer } from "redux";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import AuthReducer, {
  AuthPersistBlacklist,
  IAuthState
} from "./Reducers/Auth/Reducer";
import NotesReducer, { INotesState } from "./Reducers/Notes/Reducer";
import SecretsReducer, { ISecretsState } from "./Reducers/Secrets/Reducer";
import ThemeReducer, { IThemeState } from "./Reducers/Theme/Reducer";

export interface IRootState {
  auth: IAuthState;
  notes: INotesState;
  secrets: ISecretsState;
  theme: IThemeState;
}

const storage = localforage.createInstance({ name: "UdiaPersistance" });

const authPersistConfig: PersistConfig = {
  key: "auth",
  storage,
  blacklist: AuthPersistBlacklist
};

const notesPersistConfig: PersistConfig = {
  key: "notes",
  stateReconciler: (inboundState: any) => inboundState, // hardSet
  debug: true,
  storage
};

const secretsPersistConfig: PersistConfig = {
  key: "secrets",
  storage
};

const themePersistConfig: PersistConfig = {
  key: "theme",
  storage
};

interface IDevToolsWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer | undefined;
}
declare var window: IDevToolsWindow;

export default function configureReduxStore() {
  const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, AuthReducer),
    notes: persistReducer(notesPersistConfig, NotesReducer),
    secrets: persistReducer(secretsPersistConfig, SecretsReducer),
    theme: persistReducer(themePersistConfig, ThemeReducer)
  });

  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  const persistor = persistStore(store);
  return { store, persistor };
}
