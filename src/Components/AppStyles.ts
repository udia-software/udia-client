import * as styledComponents from "styled-components";

export interface IThemeInterface {
  backgroundColor: string;
  panelBackgroundColor: string;
  primaryColor: string;
  intermediateColor: string;
  inverseColor: string;

  purple: string;
}

const BaseTheme = {
  purple: "rebeccapurple"
}

const DarkTheme: IThemeInterface = {
  ...BaseTheme,
  backgroundColor: "#000000",
  panelBackgroundColor: "#060606",
  primaryColor: "hsla(0, 0%, 100%, 1)",
  intermediateColor: "hsla(0, 0%, 100%, 0.4)",
  inverseColor: "hsla(0, 0%, 0%, 0)",
};

const LightTheme: IThemeInterface = {
  ...BaseTheme,
  backgroundColor: "#ffffff",
  panelBackgroundColor: "#F9F9F9",
  primaryColor: "hsla(0, 0%, 0%, 1)",
  intermediateColor: "hsla(0, 0%, 0%, 0.6)",
  inverseColor: "hsla(0, 0%, 100%, 1)",
}

const StyledComponents = styledComponents as styledComponents.ThemedStyledComponentsModule<
  IThemeInterface
>;

const { default: styled, css, injectGlobal, keyframes } = StyledComponents;
const ThemeProvider: React.ComponentClass = StyledComponents.ThemeProvider;

export default styled;
export { css, injectGlobal, keyframes, ThemeProvider, DarkTheme, LightTheme };
