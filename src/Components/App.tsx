import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faEye,
  faEyeSlash,
  faUser,
  faUserSlash
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import styled from "./AppStyles";
import Footer from "./Footer";
import Header from "./Header";
import AppRoutes from "./Routes/AppRoutes";

// Font awesome icons must be loaded before use in the app
library.add(faUser);
library.add(faUserSlash);
library.add(faBars);
library.add(faEye);
library.add(faEyeSlash);

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
  min-height: 75vh;
  word-break: break-word;
  margin-bottom: 1em;
`;

export default () => (
  <AppContainer>
    <Header />
    <BodyContainer>
      <AppRoutes />
    </BodyContainer>
    <Footer />
  </AppContainer>
);
