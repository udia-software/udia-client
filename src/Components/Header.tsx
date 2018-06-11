import React from "react";
import { Link, LinkProps, RouteProps } from "react-router-dom";
import { withTheme } from "styled-components";
import { ThemedComponentProps } from "../Types";
import styled from "./AppStyles";

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
  grid-auto-flow: column;
  display: grid;
  justify-items: end;
  align-items: center;
  justify-content: end;
  align-content: center;
`;

class Header extends React.Component<ThemedComponentProps<RouteProps>> {
  public render() {
    const { location, theme } = this.props;
    const StyledSubTitleLink = StyledTitleLink.extend.attrs({
      style: ({ to }: LinkProps) => ({
        color:
          to === ((location && location.pathname) || "")
            ? theme.primaryColor
            : theme.intermediateColor
      })
    })`
      font-size: medium;
      padding: 0.4em;
      color: ${theme.intermediateColor};
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