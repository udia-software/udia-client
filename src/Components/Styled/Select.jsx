// @flow
import React from 'react';
import styled from 'styled-components';

const StyleComponent = styled.select`
  color: white;
  background-color: black;
  appearance: none;
  border-radius: 3px;
  background: transparent;
  background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 100%;
  background-position-y -3px;
  padding: 2px 2em 2px 3px;
`;

const Select = (props: {}) => <StyleComponent {...props} />;

export default Select;
