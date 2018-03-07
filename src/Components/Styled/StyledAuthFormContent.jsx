import React from "react";
import styled from "styled-components";

const StyleComponent = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-around;
`;
const StyledAuthFormContent = props => {
  return <StyleComponent {...props} />;
};

export { StyledAuthFormContent };
export default StyledAuthFormContent;
