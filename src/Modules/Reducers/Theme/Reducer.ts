import ThemeActions, { IThemeAction } from "./Actions";

export interface IThemeState {
  usingDarkTheme: boolean;
}

const ThemeState: IThemeState = {
  usingDarkTheme: true
};

export default (
  state: IThemeState = { ...ThemeState },
  action: IThemeAction
) => {
  switch (action.type) {
    case ThemeActions.TOGGLE_DARK_THEME:
      return {
        ...state,
        usingDarkTheme: !state.usingDarkTheme
      };
    default:
      return state;
  }
};
