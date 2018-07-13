import React from "react";
import { RouteComponentProps } from "react-router-dom";
import styled from "./AppStyles";
import { ThemedLink } from "./PureHelpers/ThemedLinkAnchor";

const NotFoundContainer = styled.div`
  display: grid;
  place-content: center;
  place-items: center;
`;

const StyledNotFoundText = styled.span`
  color: ${props => props.theme.purple};
`;

const NotFound = ({ location }: RouteComponentProps<any>) => {
  document.title = "Not Found - UDIA";
  return (
    <NotFoundContainer>
      <h1>Not Found</h1>
      <p>
        No match exists for{" "}
        <StyledNotFoundText>{location.pathname}</StyledNotFoundText>.
      </p>
      <ThemedLink to="/">Return to the home page →</ThemedLink>
    </NotFoundContainer>
  );
};

export default NotFound;
