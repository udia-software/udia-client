// @flow
import React from 'react';
import styled from 'styled-components';

const StyledForm = styled.form`
  grid-area: form;
  min-height: auto;
`;
const Form = (props: {}) => <StyledForm {...props} noValidate />;

export default Form;
