import AuthReducer, { IAuthState } from "./Auth/Reducer";
import NotesReducer, { INotesState } from "./Notes/Reducer";
import ThemeReducer, { IThemeState } from "./Theme/Reducer";

export interface IRootState {
  auth: IAuthState;
  notes: INotesState;
  theme: IThemeState;
}

export default {
  auth: AuthReducer,
  notes: NotesReducer,
  theme: ThemeReducer
};
