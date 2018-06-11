import React from "react";
import { Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import styled, { DarkTheme } from "./AppStyles";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import NotFound from "./NotFound";

const AppContainer = styled.div`
  transition: all 0.5s ease;
  background-color: ${props => props.theme.backgroundColor}
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: auto;
  min-height: 100vh;
  min-width: 100vw;
  grid-template-areas:
    "header"
    "content"
    "footer";
  color: ${props => props.theme.primaryColor};

  a {
    text-decoration: none;
    color: ${props => props.theme.intermediateColor};
    &:hover {
      color: ${props => props.theme.primaryColor};
    }
  }
`;

const BodyContainer = styled.div`
  grid-template-area: content;
`;

const App = () => (
  <ThemeProvider theme={DarkTheme}>
    <AppContainer>
      <Header />
      <BodyContainer>
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </BodyContainer>
      <Footer />
    </AppContainer>
  </ThemeProvider>
);

export default App;
