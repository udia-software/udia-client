import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";

const NotFound = ({ location }: RouteComponentProps<any>) => (
  <div>
    <h1>Not Found</h1>
    <p>No match exists for {location.pathname}.</p>
    <Link to="/">Return to the home page →</Link>
  </div>
);

export default NotFound;
