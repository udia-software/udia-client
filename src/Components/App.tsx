import React from "react";
import { Route, Switch } from "react-router-dom";
import styled, { DarkTheme } from "./AppStyles";
import Header from "./Header";
import Home from "./Home";
import NotFound from "./NotFound";


const AppContainer = styled.div`
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
  color: hsla(0, 0%, 100%, 0.9);
`;

const BodyContainer = styled(Switch)`
  grid-template-area: content;
`;

const App = () => (
  <AppContainer theme={DarkTheme}>
    <Header />
    <BodyContainer>
      <Route exact={true} path="/" component={Home} />
      <Route component={NotFound} />
    </BodyContainer>
    <p>Footer</p>
  </AppContainer>
);

export default App;
