import React from "react";
import styled from "./AppStyles";
import Footer from "./Footer";
import Header from "./Header";
import loadFontAwesomeIcons from "./Helpers/FontAwesomeLoader";
import Alerter from "./Notifier/Alerter";
import Status from "./Notifier/Status";
import AppRoutes from "./Routes/AppRoutes";

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
`;

const BodyContainer = styled.div`
  grid-area: content;
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 74vh;
  word-break: break-word;
  margin-bottom: 1em;
`;

export default () => {
  loadFontAwesomeIcons();
  return (
    <AppContainer>
      <Header />
      <BodyContainer>
        <AppRoutes />
      </BodyContainer>
      <Alerter />
      <Status />
      <Footer />
    </AppContainer>
  );
};
