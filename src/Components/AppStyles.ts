import * as styledComponents from "styled-components";

export interface IThemeInterface {
  backgroundColor: string;
  primaryColor: string;
}

export const DarkTheme: IThemeInterface = {
  backgroundColor: "#000000",
  primaryColor: "#e9e9eb"
};

const StyledComponents = styledComponents as styledComponents.ThemedStyledComponentsModule<
  IThemeInterface
>;

const { default: styled, css, injectGlobal, keyframes } = StyledComponents;
const ThemeProvider: React.ComponentClass = StyledComponents.ThemeProvider;

export default styled;
export { css, injectGlobal, keyframes, ThemeProvider };
