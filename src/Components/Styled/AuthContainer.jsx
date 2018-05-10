// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {};

const StyleComponent = styled.div`
  display: grid;
  grid-template-areas:
    'title'
    'form';
  grid-auto-rows: auto;
  align-content: center;
  align-items: center;
  justify-items: center;

  grid-area: content;
  grid-row-gap: 1em;
  justify-self: center;
  align-self: center;
  margin: 1em;
`;
const AuthContainer = (props: Props) => <StyleComponent {...props} />;
export { AuthContainer };
export default AuthContainer;
