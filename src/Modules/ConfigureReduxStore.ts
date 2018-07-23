import localforage from "localforage";
import { combineReducers, createStore, StoreEnhancer } from "redux";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import AuthReducer, {
  AuthPersistBlacklist,
  IAuthState
} from "./Reducers/Auth/Reducer";
import DraftItemsReducer, {
  IDraftItemsState
} from "./Reducers/DraftItems/Reducer";
import NotesReducer, { INotesState } from "./Reducers/Notes/Reducer";
import ProcessedItemsReducer, {
  IProcessedItemsState
} from "./Reducers/ProcessedItems/Reducer";
import RawItemsReducer, { IRawItemsState } from "./Reducers/RawItems/Reducer";
import SecretsReducer, { ISecretsState } from "./Reducers/Secrets/Reducer";
import StructureReducer, { IStructureState } from "./Reducers/Structure/Reducer";
import ThemeReducer, { IThemeState } from "./Reducers/Theme/Reducer";
import TransientReducer, {
  ITransientState
} from "./Reducers/Transient/Reducer";

export interface IRootState {
  auth: IAuthState;
  secrets: ISecretsState;
  rawItems: IRawItemsState;
  processedItems: IProcessedItemsState;
  draftItems: IDraftItemsState;
  structure: IStructureState;
  notes: INotesState;
  theme: IThemeState;
  transient: ITransientState;
}

const storage = localforage.createInstance({ name: "UdiaPersistance" });
const genPersistConf = (key: string): PersistConfig => ({ key, storage });

const authPersistConfig: PersistConfig = {
  ...genPersistConf("auth"),
  blacklist: AuthPersistBlacklist
};

const notesPersistConfig: PersistConfig = {
  ...genPersistConf("notes"),
  // debug: true
  stateReconciler: (
    inboundState: any,
    originialState: any,
    reducedState: any
  ) => ({ ...reducedState, ...inboundState })
};

interface IDevToolsWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer | undefined;
}
declare let window: IDevToolsWindow;

const ConfigureReduxStore = () => {
  const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, AuthReducer),
    secrets: persistReducer(genPersistConf("secrets"), SecretsReducer),
    rawItems: persistReducer(genPersistConf("rawItems"), RawItemsReducer),
    processedItems: persistReducer(
      genPersistConf("processedItems"),
      ProcessedItemsReducer
    ),
    draftItems: persistReducer(genPersistConf("draftItems"), DraftItemsReducer),
    structure: persistReducer(genPersistConf("structure"), StructureReducer),
    notes: persistReducer(notesPersistConfig, NotesReducer),
    theme: persistReducer(genPersistConf("theme"), ThemeReducer),
    transient: TransientReducer // not persisted
  });

  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  const persistor = persistStore(store);
  return { store, persistor };
};

export default ConfigureReduxStore;
