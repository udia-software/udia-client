import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

const HeaderController = ({ pathname }) => {
  const StyledHeader = styled.header`
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
    display: grid;
    grid-template-columns: 1fr 1fr;
  `;

  const StyledSubTitleLink = StyledTitleLink.extend.attrs({
    style: ({ to }) => ({
      color: to === pathname ? "hsla(0, 0%, 100%, 1)" : "hsla(0, 0%, 100%, 0.5)"
    })
  })`
    font-size: medium;
    padding: 0.4em;
    border-left: 1px solid #000;
    border-right: 1px solid #000;
    color: hsla(0, 0%, 100%, 0.5);
    transition-property: border-left, border-right, color;
    &:hover {
      color: hsla(0, 0%, 100%, 1);
      border-right: 1px solid #fff;
      border-left: 1px solid #fff;
    }
  `;

  return (
    <StyledHeader>
      <StyledTitleLink to="/">UDIA</StyledTitleLink>
      <HeaderSubMenu>
        <StyledSubTitleLink to="/sign-in">Sign In</StyledSubTitleLink>
        <StyledSubTitleLink to="/sign-up">Sign Up</StyledSubTitleLink>
      </HeaderSubMenu>
    </StyledHeader>
  );
};

function mapStateToProps(state) {
  return {
    pathname: state.routing.location.pathname
  };
}

const Header = connect(mapStateToProps)(HeaderController);

export { Header };
export default Header;
