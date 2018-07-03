import {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  FormHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes
} from "react";
import { StyledComponentClass } from "styled-components";
import styled, { IThemeInterface } from "../AppStyles";

// Types are explicitly defined here. Why?
// Otherwise I get an error saying I need to import react
// However, importing react throws an error saying react is never used
// idk

export const SignViewContainer: StyledComponentClass<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  IThemeInterface
> = styled.div`
  display: grid;
  grid-template-areas:
    "title"
    "form"
    "silinks";
  grid-auto-rows: auto;
  place-items: center;
  align-content: center;
`;

export const SignViewTitle: StyledComponentClass<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
  IThemeInterface
> = styled.h1`
  grid-area: title;
`;

export const FormContainer: StyledComponentClass<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  IThemeInterface
> = styled.form`
  grid-area: form;
`;

export const SignViewLinks: StyledComponentClass<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  IThemeInterface
> = styled.div`
  grid-area: silinks;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
  padding-top: 0.5em;
  & > a {
    padding-top: 0.5em;
  }
`;

export const FormContent: StyledComponentClass<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  IThemeInterface
> = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const FormInput: StyledComponentClass<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  IThemeInterface
> = styled.input`
  width: auto;
  padding: 0.5em;
  font-size: medium;
  background: ${props => props.theme.inputBaseBackgroundColor};
  border: 1px solid ${props => props.theme.inverseColor};
  border-radius: 3px;
  :focus {
    outline: 1px solid ${props => props.theme.purple};
    border: 1px solid ${props => props.theme.purple};
  }
`;

export const FormTextArea: StyledComponentClass<
  DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >,
  IThemeInterface
> = styled.textarea`
  flex: 1 0 auto;
  font-size: medium;
  background: ${props => props.theme.inputBaseBackgroundColor};
  border: 1px solid ${props => props.theme.inverseColor};
  border-radius: 3px;
  overflow: hidden;
  word-break: break-all;
`;

export const PasswordViewToggle: StyledComponentClass<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  IThemeInterface
> = styled.a`
  cursor: pointer;
`;

export const PasswordLabelFlex = styled.span`
  display: flex;
  justify-content: space-between;
`;

interface IFormFieldProps {
  error?: boolean;
  success?: boolean;
}

export const FormField: StyledComponentClass<
  React.ClassAttributes<HTMLDivElement> &
    HTMLAttributes<HTMLDivElement> &
    IFormFieldProps,
  IThemeInterface
> = styled.div.attrs<IFormFieldProps>({})`
  padding: 0.5em 0;
  flex-direction: column;
  > label {
    display: flex;
    flex-direction: column;
    color: ${props =>
      props.error
        ? props.theme.inputErrorColor
        : props.success
          ? props.theme.inputSuccessColor
          : "auto"};
    > input {
      grid-area: input;
      justify-items: stretch;
      align-items: center;
      justify-content: stretch;
      color: ${props =>
        props.error
          ? props.theme.inputErrorColor
          : props.success
            ? props.theme.inputSuccessColor
            : "auto"};
      background-color: ${props =>
        props.error
          ? props.theme.inputErrorBackgroundColor
          : props.success
            ? props.theme.inputSuccessBackgroundColor
            : "auto"};
      border: 1px solid
        ${props =>
          props.error
            ? props.theme.inputErrorBorderColor
            : props.success
              ? props.theme.inputSuccessBorderColor
              : "auto"};
    }
  }
`;

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
  padding: 0.3em 1.5em;
  margin: 0.5em 0;
  font-weight: 100;
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
