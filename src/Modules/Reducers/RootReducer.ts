import AuthReducer, { IAuthState } from "./Auth/Reducer";
import ThemeReducer, { IThemeState } from "./Theme/Reducer";

export interface IRootState {
  auth: IAuthState;
  theme: IThemeState;
}

const RootReducer = {
  auth: AuthReducer,
  theme: ThemeReducer,
};

export default RootReducer;
