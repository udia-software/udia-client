import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../Modules/ConfigureReduxStore";
import {
  IToggleDarkThemeAction,
  toggleDarkTheme
} from "../Modules/Reducers/Theme/Actions";
import { isUsingDarkTheme } from "../Modules/Reducers/Theme/Selectors";
import styled from "./AppStyles";
import { ThemedAnchor, ThemedLink } from "./Helpers/ThemedLinkAnchor";
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

const StyledMapLink = styled(ThemedAnchor)`
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

interface IFooterProps {
  isDarkTheme: boolean;
  toggleTheme: () => IToggleDarkThemeAction;
}

class Footer extends React.Component<IFooterProps> {
  public render() {
    const { isDarkTheme, toggleTheme } = this.props;
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
            <ThemedLink to="/">Home</ThemedLink>
            <ThemedLink to="/health">Health</ThemedLink>
            <ThemedLink to="/contact">Contact</ThemedLink>
            <ThemedAnchor onClick={toggleTheme}>
              Toggle {isDarkTheme ? "Light" : "Dark"} Theme
            </ThemedAnchor>
          </div>
        </StyledFooterLinksContainer>
      </FooterContainer>
    );
  }
}

const mapStateToProps = (state: IRootState) => ({
  isDarkTheme: isUsingDarkTheme(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleTheme: () => dispatch(toggleDarkTheme())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer);
