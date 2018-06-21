import { StyledComponentClass } from "styled-components";
import styled, { IThemeInterface } from "../AppStyles";

// Types are explicitly defined here. Why?
// Otherwise I get an error saying I need to import react
// However, importing react throws an error saying react is never used
// idk

export const SignViewContainer: StyledComponentClass<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  IThemeInterface,
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
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
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >,
  IThemeInterface,
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  >
> = styled.h1`
  grid-area: title;
`;

export const FormContainer: StyledComponentClass<
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >,
  IThemeInterface,
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >
> = styled.form`
  grid-area: form;
`;

export const SignViewLinks: StyledComponentClass<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  IThemeInterface,
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
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
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  IThemeInterface,
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const FormInput: StyledComponentClass<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  IThemeInterface,
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = styled.input`
  flex: 1 0 auto;
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
