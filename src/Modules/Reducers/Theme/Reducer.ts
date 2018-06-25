import {
  IThemeAction,
  TOGGLE_AUTH_SIDEBAR,
  TOGGLE_DARK_THEME
} from "./Actions";

export interface IThemeState {
  usingDarkTheme: boolean;
  showingAuthSidebar: boolean;
}

const ThemeState: IThemeState = {
  usingDarkTheme: true,
  showingAuthSidebar: false // mobile responsive view, show sidebar?
};

export default (
  state: IThemeState = { ...ThemeState },
  action: IThemeAction
) => {
  switch (action.type) {
    case TOGGLE_DARK_THEME:
      return {
        ...state,
        usingDarkTheme: !state.usingDarkTheme
      };
    case TOGGLE_AUTH_SIDEBAR:
      return {
        ...state,
        showingAuthSidebar: !state.showingAuthSidebar
      };
    default:
      return state;
  }
};
