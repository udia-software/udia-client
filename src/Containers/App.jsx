// @flow
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import {
  About,
  Contact,
  ForgotPassword,
  Home,
  KitchenSink,
  NoMatch,
  Profile,
  ResetPassword,
  SignIn,
  SignOut,
  SignUp,
  VerifyEmail,
} from './Pages';
import { Header, Footer } from '../Components';

const App = () => {
  const AppContainer = styled.div`
    a {
      color: hsla(0, 0%, 100%, 0.65);
      transition-property: color;
      transition-duration: 0.2s;
    }
    a:hover {
      color: hsla(0, 0%, 100%, 1);
    }
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto;
    grid-template-areas:
      'header'
      'content'
      'footer';
    min-height: 100vh;
    min-width: 100vw;
    background-color: #000000;
    color: hsla(0, 0%, 100%, 0.9);
  `;
  return (
    <AppContainer>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/kitchen-sink" component={KitchenSink} />
        <Route exact path="/sign-in" component={SignIn} />
        <Route exact path="/sign-up" component={SignUp} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/sign-out" component={SignOut} />
        <Route exact path="/verify-email/:verificationToken" component={VerifyEmail} />
        <Route exact path="/verify-email" component={VerifyEmail} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/reset-password/:verificationToken" component={ResetPassword} />
        <Route exact path="/reset-password" component={ResetPassword} />
        <Route component={NoMatch} />
      </Switch>
      <Footer />
    </AppContainer>
  );
};

export default App;
