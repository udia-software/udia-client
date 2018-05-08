// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {
  error?: boolean,
  success?: boolean,
};

const StyleComponent = styled.div`
  padding: 0.5em 0;
  flex-direction: column;
  > label {
    display: flex;
    flex-direction: column;
    color: ${props => props.color};
    > input {
      grid-area: input;
      justify-items: stretch;
      align-items: center;
      justify-content: stretch;
      color: ${props => props.color};
      background-color: ${props => props.backgroundColor};
      border: 1px solid ${props => props.color};
    }
  }
`;

const FormField = (props: Props) => {
  // convert error/success to a color
  let color = 'auto';
  let backgroundColor = 'auto';
  if (props.error) {
    color = '#9f3a38';
    backgroundColor = '#fff6f6';
  } else if (props.success) {
    color = '#2c662d';
    backgroundColor = '#fcfff5';
  }
  return <StyleComponent {...props} backgroundColor={backgroundColor} color={color} />;
};

FormField.defaultProps = {
  error: false,
  success: false,
};

export default FormField;
