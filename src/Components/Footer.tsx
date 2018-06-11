import React from "react";
import { RouteProps } from "react-router";
import { Link } from "react-router-dom";
import styled from "./AppStyles";
import Logo from "./Static/Logo";

const FooterContainer = styled.div`
  grid-area: footer;
  display: grid;
  background-color: ${props => props.theme.panelBackgroundColor};
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  justify-items: stretch;
  align-items: center;
  place-content: stretch;
  padding: 1em;
  @media screen and (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StyledFooterMapContainer = styled.div`
  justify-self: start;
`;

const StyledFooterLogoContainer = styled.div`
  place-self: center;
`;

const StyledMapLink = styled.a`
  padding-top: 0.8em;
`;

const StyledFooterLinksContainer = styled.div`
  display: grid;
  justify-self: end;
  justify-items: end;
  align-items: center;
  div {
    display: grid;
    justify-items: end;
  }
`;

export default class Footer extends React.Component<RouteProps> {
  public render() {
    return (
      <FooterContainer>
        <StyledFooterMapContainer>
          <h3>Udia Software Incorporated</h3>
          <StyledMapLink href="https://goo.gl/maps/sXheMfn7PRE2">
            Startup Edmonton<br />
            Unit 301 - 10359 104 Street NW<br />
            Edmonton, AB T5J 1B9<br />
            Canada
          </StyledMapLink>
        </StyledFooterMapContainer>
        <StyledFooterLogoContainer>
          <Logo width="100px" />
        </StyledFooterLogoContainer>
        <StyledFooterLinksContainer>
          <h3>Links</h3>
          <div>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </StyledFooterLinksContainer>
      </FooterContainer>
    );
  }
}
