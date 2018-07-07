import AuthReducer, { IAuthState } from "./Auth/Reducer";
import NotesReducer, { INotesState } from "./Notes/Reducer";
import SecretsReducer, { ISecretsState } from "./Secrets/Reducer";
import ThemeReducer, { IThemeState } from "./Theme/Reducer";

export interface IRootState {
  auth: IAuthState;
  notes: INotesState;
  secrets: ISecretsState;
  theme: IThemeState;
}

export default {
  auth: AuthReducer,
  notes: NotesReducer,
  secrets: SecretsReducer,
  theme: ThemeReducer
};
