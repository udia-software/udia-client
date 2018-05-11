// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {};

const StyleComponent = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-template-columns: auto;
  grid-auto-flow: row;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: center;

  grid-area: content;
  justify-self: center;
  align-self: center;
  margin: 1em;
`;

const CenterContainer = (props: Props) => <StyleComponent {...props} />;

export default CenterContainer;
