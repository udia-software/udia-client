import React from "react";
import { Link } from "react-router-dom";
import { Container, Header } from "semantic-ui-react";

export const NoMatch = ({ location }) => {
  document.title = "Not Found - UDIA";
  return (
    <Container>
      <Header>Page not found!</Header>
      <p>No match found for <code>{location.pathname}</code></p>
      <p><Link to="/">Go to the home page →</Link></p>
    </Container>
  );
};

export default NoMatch;
