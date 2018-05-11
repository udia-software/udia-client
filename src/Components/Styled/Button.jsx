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
      color: #000000;
      text-decoration-color: #000000;
      border-color: #000000;
      background-color: ${props.primaryColor};
    }
    &:focus {
      outline: 0;
    }`};
  ${props => props.disabled && 'opacity: 0.40;'};
`;

type Props = {
  color?: string,
  size?: string,
};

const Button = (props: Props) => {
  let primaryColor = '#ffffff';
  let sizeMultiplier = 1;

  switch (props.color) {
    case 'red':
      primaryColor = '#ff695e';
      break;
    case 'orange':
      primaryColor = '#ff851b';
      break;
    case 'yellow':
      primaryColor = '#ffe21f';
      break;
    case 'olive':
      primaryColor = '#d9e778';
      break;
    case 'green':
      primaryColor = '#2ecc40';
      break;
    case 'teal':
      primaryColor = '#6dffff';
      break;
    case 'blue':
      primaryColor = '#54c8ff';
      break;
    case 'violet':
      primaryColor = '#a291fb';
      break;
    case 'purple':
      primaryColor = '#dc73ff';
      break;
    case 'pink':
      primaryColor = '#ff8edf';
      break;
    case 'brown':
      primaryColor = '#d67c1c';
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
  return <StyleComponent primaryColor={primaryColor} fontSize={sizeMultiplier} {...props} />;
};

Button.defaultProps = {
  color: undefined,
  size: undefined,
};

export default Button;
