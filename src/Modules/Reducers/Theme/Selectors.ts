import { IRootState } from "../../ConfigureReduxStore";

export const isUsingDarkTheme = (state: IRootState) => {
  return state.theme.usingDarkTheme;
};

export const isShowingAuthSidebar = (state: IRootState) => {
  return state.theme.showingAuthSidebar;
}
