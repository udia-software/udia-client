import React from "react";
import styled from "styled-components";

const StyleComponent = styled.fieldset`
  min-width: 18rem;
`;

const AuthFormFieldset = props => {
  return <StyleComponent {...props} />;
};

export { AuthFormFieldset };
export default AuthFormFieldset;
