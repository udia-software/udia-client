import React, { ChangeEventHandler, FormEventHandler } from "react";
import { Link } from "react-router-dom";
import styled from "../AppStyles";
import Button from "../PureHelpers/Button";
import FormField from "../PureHelpers/FormField";
import FormFieldErrors from "../PureHelpers/FormFieldErrors";

export interface IProps {
  loading: boolean;
  loadingText?: string;
  email: string;
  password: string;
  errors: string[];
  emailErrors: string[];
  passwordErrors: string[];
  handleChangeEmail: ChangeEventHandler;
  handleChangePassword: ChangeEventHandler;
  handleSubmit: FormEventHandler;
}

const SignInContainer = styled.div`
  display: grid;
  grid-template-areas:
    "title"
    "form"
    "silinks";
  grid-auto-rows: auto;
  place-items: center;
  align-content: center;
`;

const SignInTitle = styled.h1`
  grid-area: title;
`;

const FormContainer = styled.form`
  grid-area: form;
`;

const SignInLinks = styled.div`
  grid-area: silinks;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
  padding-top: 0.5em;
  &>a {
    padding-top: 0.5em;
  }
`;

const FormContent = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-evenly;
`;

const FormInput = styled.input`
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

const SignInView = ({
  loading,
  loadingText,
  email,
  password,
  errors,
  emailErrors,
  passwordErrors,
  handleChangeEmail,
  handleChangePassword,
  handleSubmit
}: IProps) => (
  <SignInContainer>
    <SignInTitle>Sign In</SignInTitle>
    <FormContainer onSubmit={handleSubmit}>
      <fieldset>
        <legend>Welcome back, User.</legend>
        <FormFieldErrors errors={errors} />
        <FormContent>
          <FormField error={emailErrors.length > 0}>
            <label htmlFor="email">
              Email:
              <FormInput
                type="email"
                id="email"
                placeholder="your@email.tld"
                onChange={handleChangeEmail}
                value={email}
              />
            </label>
            <FormFieldErrors errors={emailErrors} />
          </FormField>
          <FormField error={passwordErrors.length > 0}>
            <label htmlFor="pw">
              Password:
              <FormInput
                type="password"
                id="pw"
                placeholder="••••••••"
                onChange={handleChangePassword}
                value={password}
              />
            </label>
            <FormFieldErrors errors={passwordErrors} />
          </FormField>
          <Button>Sign In</Button>
        </FormContent>
      </fieldset>
    </FormContainer>
    <SignInLinks>
      <Link to="/sign-up">I don&apos;t have an account →</Link>
      <Link to="/forgot-password">I forgot my password.</Link>
    </SignInLinks>
  </SignInContainer>
);

export default SignInView;
