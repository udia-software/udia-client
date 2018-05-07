// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {
  error: boolean,
};

const StyleComponent = styled.div`
  display: flex;
  padding: 0.5em 0;
  flex-direction: column;
  > label {
    display: flex;
    flex-direction: column;
    color: ${props => (props.error ? '#e0b4b4' : 'auto')};
    > input {
      color: ${props => (props.error ? '#9f3a38' : 'auto')};
      background-color: ${props => (props.error ? '#e0b4b4' : 'auto')};
    }
  }
`;

const FormField = (props: Props) => <StyleComponent {...props} />;

export default FormField;
