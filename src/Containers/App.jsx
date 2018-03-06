import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";

import "./App.css"
import { Home } from "Containers/Pages";
import Header from "Components/Header";

class App extends Component {
  render() {
    const AppContainer = styled.div`
      display: grid;
      grid-template-rows: auto 1fr 30px;
      grid-template-columns: auto;
      grid-template-areas:
        "header"
        "content"
        "footer";
      min-height: 100vh;
      min-width: 100vw;
    `;

    const FooterContainer = styled.div`
      grid-area: footer;
    `;
    return (
      <AppContainer>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
        <FooterContainer>Footer</FooterContainer>
      </AppContainer>
    );
  }
}

export default App;
