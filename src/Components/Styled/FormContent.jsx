// @flow
import React from 'react';
import styled from 'styled-components';

const StyleComponent = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-around;
`;
const FormContent = (props: {}) => <StyleComponent {...props} />;

export default FormContent;
