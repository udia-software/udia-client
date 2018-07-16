import React, { ReactNode } from "react";
import { connect } from "react-redux";
import { ThemeProvider } from "styled-components";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { isUsingDarkTheme } from "../../Modules/Reducers/Theme/Selectors";
import { DarkTheme, LightTheme } from "../AppStyles";

interface IProps {
  isDarkTheme: boolean;
  children: ReactNode; // Child must exist, this is a wrapper
}

const ToggleableThemeProvider = (props: IProps) => (
  <ThemeProvider
    {...props}
    theme={props.isDarkTheme ? DarkTheme : LightTheme}
  />
);

const mapStateToProps = (state: IRootState) => ({
  isDarkTheme: isUsingDarkTheme(state)
});

export default connect(mapStateToProps)(ToggleableThemeProvider);
