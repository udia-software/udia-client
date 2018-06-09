import React from "react";
import { RouteProps } from "react-router";
import { Link, LinkProps } from "react-router-dom";
import styled from "./AppStyles";

const HeaderContainer = styled.div`
  grid-area: header;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: #040404;
  align-items: center;
  padding: 0 0.4em;
`;


const StyledTitleLink = styled(Link)`
  justify-self: start;
  padding: 0.4em;
  font-weight: 400;
  color: #fff;
  text-decoration: none;
  font-size: x-large;
  border-left: 1px solid #000;
  border-right: 1px solid #000;
  transition-property: border-left, border-right;
  transition-duration: 0.2s;
  &:hover {
    border-right: 1px solid #fff;
    border-left: 1px solid #fff;
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

export default class Header extends React.Component<RouteProps> {
  public render() {
    const { location } = this.props;
    const StyledSubTitleLink = StyledTitleLink.extend.attrs({
      style: ({ to }: LinkProps) => ({
        color:
          to === ((location && location.pathname) || "")
            ? "hsla(0, 0%, 100%, 1)"
            : "hsla(0, 0%, 100%, 0.5)"
      })
    })`
      font-size: medium;
      padding: 0.4em;
      color: hsla(0, 0%, 100%, 0.5);
      &:hover {
        color: hsla(0, 0%, 100%, 1);
        border-right: 1px solid #fff;
        border-left: 1px solid #fff;
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
