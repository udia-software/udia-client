// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {};

const StyleComponent = styled.input`
  flex: 1 0 auto;
  width: auto;
  padding: 0.5em;
  font-size: medium;
  background: hsla(0, 0%, 100%, 0.9);
  border: none;
  border-radius: 3px;
`;

const Input = (props: Props) => <StyleComponent {...props} />;

export default Input;
