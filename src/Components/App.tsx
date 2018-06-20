import React from "react";
import { Route, Switch } from "react-router-dom";
import styled from "./AppStyles";
import SignInController from "./Auth/SignInController";
import Footer from "./Footer";
import Header from "./Header";
import Health from "./Health";
import Home from "./Home";
import NotFound from "./NotFound";
import WithAuthentication from "./Wrapper/WithAuthentication";

const AppContainer = styled.div`
  transition: all 0.5s ease;
  background-color: ${props => props.theme.backgroundColor}
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  min-height: 100vh;
  width: 100%;
  grid-template-areas:
    "header"
    "content"
    "footer";
  color: ${props => props.theme.primaryColor};

  a {
    transition: color 0.1s ease;
    text-decoration: none;
    color: ${props => props.theme.intermediateColor};
    &:hover {
      color: ${props => props.theme.primaryColor};
    }
  }
`;

const BodyContainer = styled.div`
  grid-area: content;
  display: grid;
  width: 100%;
  height: 100%;
`;

export default () => (
  <AppContainer>
    <Header />
    <BodyContainer>
      <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/health" component={Health} />
        <Route
          exact={true}
          path="/sign-in"
          component={WithAuthentication(
            SignInController,
            false,
            "/",
            "/sign-in"
          )}
        />
        <Route component={NotFound} />
      </Switch>
    </BodyContainer>
    <Footer />
  </AppContainer>
);
