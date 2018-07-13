import { DetailedHTMLProps } from "react";
import { StyledComponentClass } from "styled-components";
import styled, { IThemeInterface } from "../AppStyles";

export const Button: StyledComponentClass<
  DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  IThemeInterface
> = styled.button`
  color: ${props => props.theme.primaryColor};
  border-color: ${props => `${props.theme.primaryColor}`};
  background-color: ${props => props.theme.inverseColor};
  border-radius: 0.4rem;
  border-width: 1.8px;
  display: inline-block;
  min-height: 1em;
  padding: 0.3em 0em;
  margin: 0.5em 0;
  font-weight: 100;
  transition-property: all;
  transition-duration: 0.2s;
  width: 100%;
  ${props =>
    !!props.disabled
      ? `
      opacity: 0.40;
      color: ${props.theme.inputErrorColor};
      border-color: ${props.theme.inputErrorBorderColor};
      background-color: ${props.theme.inputErrorBackgroundColor};
      cursor: not-allowed;`
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
