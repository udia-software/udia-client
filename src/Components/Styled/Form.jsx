// @flow
import React from 'react';
import styled from 'styled-components';

type Props = {
  gridArea?: string,
};

const StyledForm = styled.form`
  grid-area: ${props => props.gridArea};
  min-height: auto;
`;
const Form = (props: Props) => <StyledForm {...props} noValidate />;
Form.defaultProps = {
  gridArea: 'form',
};

export default Form;
