// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import './App.css'; // Application Loaded Site Wide Styles
import {
  About,
  Contact,
  ForgotPassword,
  Home,
  KitchenSink,
  Profile,
  NoMatch,
  SignIn,
  SignUp,
  SignOut,
  VerifyEmail,
  WebCryptoPage,
} from './Pages';
import { Header, Footer } from '../Components';

const App = () => {
  const AppContainer = styled.div`
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto;
    grid-template-areas:
      'header'
      'content'
      'footer';
    min-height: 100vh;
    min-width: 100vw;
  `;
  return (
    <AppContainer>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/kitchen-sink" component={KitchenSink} />
        <Route exact path="/web-crypto" component={WebCryptoPage} />
        <Route exact path="/sign-in" component={SignIn} />
        <Route exact path="/sign-up" component={SignUp} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/sign-out" component={SignOut} />
        <Route exact path="/verify-email/:verificationToken" component={VerifyEmail} />
        <Route exact path="/verify-email" component={VerifyEmail} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route component={NoMatch} />
      </Switch>
      <Footer />
    </AppContainer>
  );
};

export default App;
