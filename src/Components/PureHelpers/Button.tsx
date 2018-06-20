import React, { ReactNode } from "react";
import styled from "../AppStyles";

const StyleComponent = styled.button.attrs<{ fontSize: number }>({})`
  color: ${props => props.theme.primaryColor};
  border-color: ${props => `${props.theme.primaryColor}`};
  background-color: ${props => props.theme.inverseColor};
  border-radius: 0.4rem;
  border-width: 1.8px;
  display: inline-block;
  min-height: 1em;
  padding: 0.3em 1.5em;
  margin: 0.5em 0;
  font-weight: 100;
  font-size: ${props => props.fontSize}rem;
  transition-property: all;
  transition-duration: 0.2s;
  ${props =>
    !!props.disabled
      ? "opacity: 0.40;"
      : `
    cursor: pointer;
    &:hover {
      color: ${props.theme.inverseColor};
      border-color: ${props.theme.inverseColor};
      background-color: ${props.theme.primaryColor};
    }
    &:focus {
      outline: none;
      border-color: ${props.theme.purple};
    }
    &:active {
      background-color: ${props.theme.purple};
    }`};
`;

export interface IProps {
  size?: string;
  children?: ReactNode;
}

const Button = (props: IProps) => {
  let sizeMultiplier = 1;

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
  return <StyleComponent fontSize={sizeMultiplier} {...props} />;
};

export default Button;
