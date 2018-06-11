import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import styled from "./AppStyles";

const StyledNotFoundText = styled.span`
  color: ${props => props.theme.purple};
`

const NotFound = ({ location }: RouteComponentProps<any>) => (
  <div>
    <h1>Not Found</h1>
    <p>No match exists for <StyledNotFoundText>{location.pathname}</StyledNotFoundText>.</p>
    <Link to="/">Return to the home page →</Link>
  </div>
);

export default NotFound;
