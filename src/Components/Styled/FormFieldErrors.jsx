// @flow
import React from 'react';
import styled from 'styled-components';

const StyleComponent = styled.ul`
  display: ${props => (props.errors.length > 0 ? 'auto' : 'none')};
  padding-left: 1em;
  margin-top: 0.4em;
  margin-bottom: 0;
  list-style: none;
  > li {
    ::before {
      content: '↑';
      color: #9f3a38;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
    }
  }
`;

type Props = {
  errors: string[],
};

const FormFieldErrors = (props: Props) => {
  const { errors } = props;
  return (
    <StyleComponent {...props}>{errors.map(error => <li key={error}>{error}</li>)}</StyleComponent>
  );
};

export default FormFieldErrors;
