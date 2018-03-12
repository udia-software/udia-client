import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyleComponent = styled.button`
  background-color: transparent;
  color: ${props => props.primaryColor};
  border-color: ${props => props.primaryColor};
  text-decoration-color: ${props => props.primaryColor};
  border-radius: 0.4rem;
  border-width: 2px;
  cursor: pointer;
  display: inline-block;
  min-height: 1em;
  padding: 0.3em 1.5em;
  margin: 0.5em 0;
  font-weight: 100;
  font-size: large;
  transition-property: color, border-color, background-color;
  transition-duration: 0.2s;
  &:hover {
    color: ${props => props.fallbackColor};
    text-decoration-color: ${props => props.fallbackColor};
    border-color: ${props => props.fallbackColor};
    background-color: ${props => props.primaryColor};
  }
  &:focus {
    outline: 0;
  }
`;

const Button = props => {
  let primaryColor = "#ffffff";
  let fallbackColor = "#000000";

  switch (props.color) {
    case "blue":
      primaryColor = "#54c8ff";
      fallbackColor = "#000000";
      break;
    default:
      break;
  }
  return (
    <StyleComponent
      primaryColor={primaryColor}
      fallbackColor={fallbackColor}
      {...props}
    />
  );
};

Button.propTypes = {
  color: PropTypes.string
};

export { Button };
export default Button;
