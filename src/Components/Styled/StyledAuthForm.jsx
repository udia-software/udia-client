import React from "react";
import styled from "styled-components";

const StyledForm = styled.form`
  grid-area: form;
  min-height: auto;
`;
const StyledAuthForm = props => {
  return <StyledForm {...props} />;
};

export { StyledAuthForm };
export default StyledAuthForm;
