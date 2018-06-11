import * as styledComponents from "styled-components";

export interface IThemeInterface {
  backgroundColor: string;
  panelBackgroundColor: string;
  primaryColor: string;
  intermediateColor: string;
  inverseColor: string;

  purple: string;
}

export const DarkTheme: IThemeInterface = {
  backgroundColor: "#000000",
  panelBackgroundColor: "#040404",
  primaryColor: "hsla(0, 0%, 100%, 1)",
  intermediateColor: "hsla(0, 0%, 100%, 0.5)",
  inverseColor: "hsla(0, 0%, 0%, 0)",
  purple: "rebeccapurple"
};

const StyledComponents = styledComponents as styledComponents.ThemedStyledComponentsModule<
  IThemeInterface
>;

const { default: styled, css, injectGlobal, keyframes } = StyledComponents;
const ThemeProvider: React.ComponentClass = StyledComponents.ThemeProvider;

export default styled;
export { css, injectGlobal, keyframes, ThemeProvider };
