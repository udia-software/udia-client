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
  font-size: ${props => props.fontSize}rem;
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
  let sizeMultiplier = 1;

  switch (props.color) {
    case "blue":
      primaryColor = "#54c8ff";
      fallbackColor = "#000000";
      break;
    default:
      break;
  }

  switch (props.size) {
    case "mini":
      sizeMultiplier = 0.78571429;
      break;
    case "tiny":
      sizeMultiplier = 0.85714286;
      break;
    case "small":
      sizeMultiplier = 0.92857143;
      break;
    case "medium":
      sizeMultiplier = 1;
      break;
    case "large":
      sizeMultiplier = 1.14285714;
      break;
    case "big":
      sizeMultiplier = 1.28571429;
      break;
    case "huge":
      sizeMultiplier = 1.42857143;
      break;
    case "massive":
      sizeMultiplier = 1.71428571;
      break;
    default:
      break;
  }
  return (
    <StyleComponent
      primaryColor={primaryColor}
      fallbackColor={fallbackColor}
      fontSize={sizeMultiplier}
      {...props}
    />
  );
};

Button.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string
};

export { Button };
export default Button;
