// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NoMatchPageContainer = styled.div`
  display: grid;
  grid-auto-rows: auto;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: center;

  grid-area: content;
  justify-self: center;
  align-self: center;
  margin: 1em;
`;

const InvalidPathnameCode = styled.code`
  color: rebeccapurple;
`;

type Props = {
  location: Location,
};

const NoMatch = ({ location }: Props) => {
  document.title = 'Not Found - UDIA';

  return (
    <NoMatchPageContainer>
      <h1>Page Not Found</h1>
      <p>
        No match exists for `<InvalidPathnameCode>{location.pathname}</InvalidPathnameCode>`.
      </p>
      <Link to="/">Go to the home page →</Link>
    </NoMatchPageContainer>
  );
};
export default NoMatch;
