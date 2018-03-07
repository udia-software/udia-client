import React from "react";
import styled from "styled-components";

const StyleComponent = styled.button`
  background-color: transparent;
  color: hsla(206, 73%, 47%, 0.65);
  border-color: hsla(206, 73%, 47%, 0.65);
  border-radius: 0.4rem;
  border-width: 2px;
  cursor: pointer;
  display: inline-block;
  min-height: 1em;
  padding: 0.3em 1.5em;
  margin: 0.5em 0;
  font-weight: 100;
  font-size: large;
  transition-property: color, border-color;
  transition-duration: 0.2s;
  &:hover {
    color: hsla(206, 73%, 47%, 1);
    border-color: hsla(206, 73%, 47%, 1);
  }
`;
const StyledAuthButton = props => {
  return <StyleComponent {...props} />;
};

export { StyledAuthButton };
export default StyledAuthButton;
