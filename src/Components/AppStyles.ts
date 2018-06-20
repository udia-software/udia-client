import * as styledComponents from "styled-components";

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

  inputErrorColor: string;
  inputErrorBorderColor: string;
  inputErrorBackgroundColor: string;
  inputBaseBackgroundColor: string;
}

const BaseTheme = {
  purple: "rebeccapurple",
  inputErrorColor: "#9f3a38",
  inputErrorBorderColor: "#e0b4b4",
  inputErrorBackgroundColor: "#fff6f6"
};

const DarkTheme: IThemeInterface = {
  ...BaseTheme,
  backgroundColor: "#000000",
  panelBackgroundColor: "#040404",
  primaryColor: "hsla(0, 0%, 100%, 1)",
  intermediateColor: "hsla(0, 0%, 100%, 0.4)",
  inverseColor: "hsla(0, 0%, 0%, 1)",
  red: "red",
  green: "green",
  yellow: "yellow",
  inputBaseBackgroundColor: "hsla(0, 0%, 100%, 0.95)"
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
  yellow: "goldenrod",

  inputBaseBackgroundColor: "hsla(0, 0%, 0%, 0.05)"
};

const StyledComponents = styledComponents as styledComponents.ThemedStyledComponentsModule<
  IThemeInterface
>;

const { default: styled, css, injectGlobal, keyframes } = StyledComponents;
const ThemeProvider: React.ComponentClass = StyledComponents.ThemeProvider;

export default styled;
export { css, injectGlobal, keyframes, ThemeProvider, DarkTheme, LightTheme };
