import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Logo } from "Static";

export const Footer = () => {
  const StyledFooter = styled.div`
    grid-area: footer;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    background-color: #040404;
    justify-items: center;
    padding: 1em;

    @media screen and (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  `;

  const StyledFooterMapContainer = styled.div`
    display: grid;
    justify-self: start;
  `;

  const StyledMapLink = styled.a`
    padding-top: 0.8em;
    text-decoration: none;
  `;

  const StyledFooterLinksContainer = styled.div`
    display: grid;
    justify-self: end;
    justify-items: end;
    justify-content: space-between;
    grid-row-gap: 1em;
    align-items: center;
    div {
      display: grid;
      grid-row-gap: 0.2em;
      justify-items: end;
    }
    a {
      text-decoration: none;
      align-self: end;
    }
  `;

  return (
    <StyledFooter>
      <StyledFooterMapContainer>
        <h3>Udia Software Incorporated</h3>
        <StyledMapLink href="https://goo.gl/maps/sXheMfn7PRE2">
          Startup Edmonton<br />
          Unit 301 - 10359 104 Street NW<br />
          Edmonton, AB T5J 1B9<br />
          Canada
        </StyledMapLink>
      </StyledFooterMapContainer>
      <Logo />
      <StyledFooterLinksContainer>
        <h3>Links</h3>
        <div>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/kitchen-sink">Kitchen Sink</Link>
        </div>
      </StyledFooterLinksContainer>
    </StyledFooter>
  );
};
export default Footer;
