import * as styledComponents from "styled-components";

export interface IThemeInterface {
  smScrnBrkPx: number;

  backgroundColor: string;
  panelBackgroundColor: string;
  primaryColor: string;
  intermediateColor: string;
  inverseColor: string;
  pulse: string;

  red: string;
  purple: string;
  green: string;
  yellow: string;

  inputErrorColor: string;
  inputErrorBorderColor: string;
  inputErrorBackgroundColor: string;
  inputBaseBackgroundColor: string;
}

const StyledComponents = styledComponents as styledComponents.ThemedStyledComponentsModule<
  IThemeInterface
>;

const { default: styled, css, injectGlobal, keyframes } = StyledComponents;
const ThemeProvider: React.ComponentClass = StyledComponents.ThemeProvider;

const BaseTheme = {
  smScrnBrkPx: 768,
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
  pulse: keyframes`
    0% {
      fill: hsla(0, 0%, 100%, 0);
    }
    80% {
      fill: hsla(0, 0%, 100%, 1);
    }
    100% {
      fill: hsla(0, 0%, 100%, 8);
    }
  `,
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
  pulse: keyframes`
    0% {
      fill: hsla(0, 0%, 0%, 0);
    }
    80% {
      fill: hsla(0, 0%, 0%, 1);
    }
    100% {
      fill: hsla(0, 0%, 0%, 8);
    }
  `,

  red: "darkred",
  green: "darkgreen",
  yellow: "goldenrod",

  inputBaseBackgroundColor: "hsla(0, 0%, 0%, 0.05)"
};

export default styled;
export { css, injectGlobal, keyframes, ThemeProvider, DarkTheme, LightTheme };
