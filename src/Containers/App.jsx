import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";

import "./App.css";
import { Home, NoMatch, SignIn, SignUp } from "Containers/Pages";
import { Header, Footer } from "Components";

class App extends Component {
  render() {
    const AppContainer = styled.div`
      display: grid;
      grid-template-rows: auto 1fr auto;
      grid-template-columns: auto;
      grid-template-areas:
        "header"
        "content"
        "footer";
      min-height: 100vh;
      min-width: 100vw;
    `;
    return (
      <AppContainer>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/sign-in" component={SignIn} />
          <Route exact path="/sign-up" component={SignUp} />
          <Route component={NoMatch} />
        </Switch>
        <Footer />
      </AppContainer>
    );
  }
}

export default App;
