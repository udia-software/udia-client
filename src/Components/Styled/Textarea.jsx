// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {};
const StyledComponent = styled.textarea`
  background: black;
  color: white;
  border-radius: 1em;
`;

const Textarea = (props: Props) => <StyledComponent {...props} />;
export default Textarea;
