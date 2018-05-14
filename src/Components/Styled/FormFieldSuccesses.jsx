// @flow
import React from 'react';
import styled from 'styled-components';

const StyleComponent = styled.ul`
  display: ${props => (props.successes.length > 0 ? 'auto' : 'none')};
  padding-left: 1em;
  margin-top: 0.4em;
  margin-bottom: 0;
  list-style: none;
  > li {
    ::before {
      content: '\u2713';
      color: #2c662d;
      display: inline-block;
      width: 1em;
      margin-left: -1em;
      padding-right: 0.2em;
    }
  }
`;

type Props = {
  successes: string[],
};

const FormFieldSuccesses = (props: Props) => {
  const { successes } = props;
  return (
    <StyleComponent {...props}>
      {successes.map(success => <li key={success}>{success}</li>)}
    </StyleComponent>
  );
};

export default FormFieldSuccesses;
