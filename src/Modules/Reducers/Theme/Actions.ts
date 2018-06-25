export const TOGGLE_DARK_THEME: "theme/TOGGLE_DARK_THEME" = "theme/TOGGLE_DARK_THEME";
export const TOGGLE_AUTH_SIDEBAR: "theme/TOGGLE_AUTH_SIDEBAR" =
  "theme/TOGGLE_AUTH_SIDEBAR";

export interface IToggleDarkThemeAction {
  type: typeof TOGGLE_DARK_THEME;
}

export interface IToggleAuthSidebarAction {
  type: typeof TOGGLE_AUTH_SIDEBAR;
}

export type IThemeAction = IToggleDarkThemeAction | IToggleAuthSidebarAction;

export const toggleDarkTheme = (): IToggleDarkThemeAction => ({
  type: TOGGLE_DARK_THEME
});

export const toggleAuthSidebar = (): IToggleAuthSidebarAction => ({
  type: TOGGLE_AUTH_SIDEBAR
});
