const TOGGLE_DARK_THEME: "theme/TOGGLE_DARK_THEME" = "theme/TOGGLE_DARK_THEME";

export interface IToggleDarkThemeAction {
  type: typeof TOGGLE_DARK_THEME;
}

export type IThemeAction = IToggleDarkThemeAction;

export const toggleDarkTheme = (): IToggleDarkThemeAction => ({
  type: TOGGLE_DARK_THEME
});

export default {
  TOGGLE_DARK_THEME
};
