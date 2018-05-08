// @flow
import React from 'react';
import styled from 'styled-components';

const StyleComponent = styled.button`
  background-color: transparent;
  color: ${props => props.primaryColor};
  border-color: ${props => props.primaryColor};
  text-decoration-color: ${props => props.primaryColor};
  border-radius: 0.4rem;
  border-width: 2px;
  display: inline-block;
  min-height: 1em;
  padding: 0.3em 1.5em;
  margin: 0.5em 0;
  font-weight: 100;
  font-size: ${props => props.fontSize}rem;
  transition-property: color, border-color, background-color;
  transition-duration: 0.2s;
  ${props =>
    !props.disabled &&
    `
    cursor: pointer;
    &:hover {
      color: ${props.fallbackColor};
      text-decoration-color: ${props.fallbackColor};
      border-color: ${props.fallbackColor};
      background-color: ${props.primaryColor};
    }
    &:focus {
      outline: 0;
    }`};
  ${props => props.disabled && 'opacity: 0.40;'};
`;

type Props = {
  color: string,
  size: string,
};

const Button = (props: Props) => {
  let primaryColor = '#ffffff';
  let fallbackColor = '#000000';
  let sizeMultiplier = 1;

  switch (props.color) {
    case 'blue':
      primaryColor = '#54c8ff';
      fallbackColor = '#000000';
      break;
    default:
      break;
  }

  switch (props.size) {
    case 'mini':
      sizeMultiplier = 0.78571429;
      break;
    case 'tiny':
      sizeMultiplier = 0.85714286;
      break;
    case 'small':
      sizeMultiplier = 0.92857143;
      break;
    case 'medium':
      sizeMultiplier = 1;
      break;
    case 'large':
      sizeMultiplier = 1.14285714;
      break;
    case 'big':
      sizeMultiplier = 1.28571429;
      break;
    case 'huge':
      sizeMultiplier = 1.42857143;
      break;
    case 'massive':
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

export { Button };
export default Button;
