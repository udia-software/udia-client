import React from "react";
import styled from "styled-components";

const StyleComponent = styled.fieldset`
  min-width: 15rem;
`;

const StyledAuthFormFieldset = props => {
  return <StyleComponent {...props} />;
};

export { StyledAuthFormFieldset };
export default StyledAuthFormFieldset;
