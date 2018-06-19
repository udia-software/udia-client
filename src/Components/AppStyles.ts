import * as styledComponents from "styled-components";

/**
 * Define all of the colors and 
 */
export interface IThemeInterface {
  backgroundColor: string;
  panelBackgroundColor: string;
  primaryColor: string;
  intermediateColor: string;
  inverseColor: string;

  red: string;
  purple: string;
  green: string;
  yellow: string;
}

const BaseTheme = {
  purple: "rebeccapurple"
};

const DarkTheme: IThemeInterface = {
  ...BaseTheme,
  backgroundColor: "#000000",
  panelBackgroundColor: "#040404",
  primaryColor: "hsla(0, 0%, 100%, 1)",
  intermediateColor: "hsla(0, 0%, 100%, 0.4)",
  inverseColor: "hsla(0, 0%, 0%, 0)",
  red: "red",
  green: "green",
  yellow: "yellow"
};

const LightTheme: IThemeInterface = {
  ...BaseTheme,
  backgroundColor: "#ffffff",
  panelBackgroundColor: "#FBFBFB",
  primaryColor: "hsla(0, 0%, 0%, 1)",
  intermediateColor: "hsla(0, 0%, 0%, 0.6)",
  inverseColor: "hsla(0, 0%, 100%, 1)",
  red: "darkred",
  green: "darkgreen",
  yellow: "goldenrod"
};

const StyledComponents = styledComponents as styledComponents.ThemedStyledComponentsModule<
  IThemeInterface
>;

const { default: styled, css, injectGlobal, keyframes } = StyledComponents;
const ThemeProvider: React.ComponentClass = StyledComponents.ThemeProvider;

export default styled;
export { css, injectGlobal, keyframes, ThemeProvider, DarkTheme, LightTheme };
