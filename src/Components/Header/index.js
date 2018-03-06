import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Header = () => {
  const StyledHeader = styled.header`
    grid-area: header;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: #222;
    align-items: center;
  `;

  const StyledTitleLink = styled(Link)`
    justify-self: start;
    margin: 0.4em;
    font-weight: 400;
    color: #fff;
    &:hover {
      transition: fill 0.25s;
      color: #000;
    }
  `
  const menuStyle = {
    justifySelf: "end",
    margin: "0.4em"
  };

  return (
    <StyledHeader>
      <StyledTitleLink to="/">UDIA</StyledTitleLink>
      <div style={menuStyle}>
        <h3>Login</h3>
      </div>
    </StyledHeader>
  );
};
export default Header;
