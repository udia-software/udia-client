import React from "react";
import { Link, RouteProps } from "react-router-dom";
import { withTheme } from "styled-components";
import styled, { IThemeInterface } from "./AppStyles";

const HeaderContainer = styled.div`
  grid-area: header;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: ${props => props.theme.panelBackgroundColor};
  align-items: center;
  padding: 0 0.4em;
`;

const StyledTitleLink = styled(Link)`
  justify-self: start;
  align-self: center;
  padding: 0.4em;
  font-weight: 400;
  font-size: x-large;
  border-left: 1px solid ${props => props.theme.inverseColor};
  border-right: 1px solid ${props => props.theme.inverseColor};
  transition-property: border-left, border-right;
  transition-duration: 0.2s;
  &:hover {
    border-right: 1px solid ${props => props.theme.primaryColor};
    border-left: 1px solid ${props => props.theme.primaryColor};
  }
`;

const HeaderSubMenu = styled.div`
  justify-self: end;
  align-self: center;
  grid-auto-flow: column;
  display: grid;
  justify-items: end;
  align-items: center;
  justify-content: end;
  align-content: center;
`;

export interface IProps extends RouteProps {
  theme: IThemeInterface;
}

class Header extends React.Component<IProps> {
  public render() {
    const { location, theme } = this.props;
    const StyledSubTitleLink = StyledTitleLink.extend`
      font-size: medium;
      padding: 0.4em;
      color: ${props =>
        props.to === location && location.pathname
          ? props.theme.primaryColor
          : props.theme.intermediateColor};
      border-right: 1px solid ${theme.inverseColor};
      border-left: 1px solid ${theme.inverseColor};
      &:hover {
        border-right: 1px solid ${theme.primaryColor};
        border-left: 1px solid ${theme.primaryColor};
      }
    `;

    return (
      <HeaderContainer>
        <StyledTitleLink to="/">UDIA</StyledTitleLink>
        <HeaderSubMenu>
          <StyledSubTitleLink to="/sign-in">Sign In</StyledSubTitleLink>
        </HeaderSubMenu>
      </HeaderContainer>
    );
  }
}

export default withTheme(Header);
