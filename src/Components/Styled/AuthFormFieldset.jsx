// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {};

const StyleComponent = styled.fieldset`
  min-width: 18rem;
`;

const AuthFormFieldset = (props: Props) => <StyleComponent {...props} />;

export default AuthFormFieldset;
