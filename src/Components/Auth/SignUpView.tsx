import React, {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler
} from "react";
import { Link } from "react-router-dom";
import Button from "../PureHelpers/Button";
import FormField from "../PureHelpers/FormField";
import FormFieldErrors from "../PureHelpers/FormFieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import {
  FormContainer,
  FormContent,
  FormInput,
  SignViewContainer,
  SignViewLinks,
  SignViewTitle
} from "./SignViewShared";

export interface IProps {
  loading: boolean;
  loadingText?: string;
  emailValidating: boolean;
  emailValidated: boolean;
  usernameValidating: boolean;
  usernameValidated: boolean;
  passwordValidated: boolean;
  email: string;
  username: string;
  password: string;
  errors: string[];
  emailErrors: string[];
  usernameErrors: string[];
  passwordErrors: string[];
  handleChangeEmail: ChangeEventHandler<HTMLInputElement>;
  handleEmailBlur: FocusEventHandler<HTMLInputElement>;
  handleChangeUsername: ChangeEventHandler<HTMLInputElement>;
  handleUsernameBlur: FocusEventHandler<HTMLInputElement>;
  handleChangePassword: ChangeEventHandler<HTMLInputElement>;
  handlePasswordBlur: FocusEventHandler<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

const SignUpView = ({
  loading,
  loadingText,
  emailValidating,
  emailValidated,
  usernameValidating,
  usernameValidated,
  passwordValidated,
  email,
  username,
  password,
  errors,
  emailErrors,
  usernameErrors,
  passwordErrors,
  handleChangeEmail,
  handleEmailBlur,
  handleChangeUsername,
  handleUsernameBlur,
  handleChangePassword,
  handlePasswordBlur,
  handleSubmit
}: IProps) => (
  <SignViewContainer>
    <GridTemplateLoadingOverlay
      gridAreaName="form"
      loading={loading}
      loadingText={loadingText}
    />
    <SignViewTitle>Sign Up</SignViewTitle>
    <FormContainer onSubmit={handleSubmit}>
      <fieldset>
        <legend>Hello there, User.</legend>
        <FormFieldErrors errors={errors} />
        <FormContent>
          <FormField
            error={usernameErrors.length > 0}
            // success={usernameValidated}
            // warn={usernameValidating}
          >
            <label htmlFor="username">
              Username:{usernameValidating && " \u2026"}
              {usernameValidated && " \u2713"}
              <FormInput
                type="text"
                id="username"
                placeholder="alex"
                onChange={handleChangeUsername}
                onBlur={handleUsernameBlur}
                value={username}
              />
            </label>
            <FormFieldErrors errors={usernameErrors} />
          </FormField>
          <FormField
            error={emailErrors.length > 0}
            // success={emailValidated}
            // warn={emailValidating}
          >
            <label htmlFor="email">
              Email:{emailValidating && " \u2026"}
              {emailValidated && " \u2713"}
              <FormInput
                type="email"
                id="email"
                placeholder="your@email.tld"
                onChange={handleChangeEmail}
                onBlur={handleEmailBlur}
                value={email}
              />
            </label>
            <FormFieldErrors errors={emailErrors} />
          </FormField>
          <FormField
            error={passwordErrors.length > 0}
            // success={passwordValidated}
          >
            <label htmlFor="pw">
              Password:
              <FormInput
                type="password"
                id="pw"
                placeholder="••••••••"
                onChange={handleChangePassword}
                onBlur={handlePasswordBlur}
                value={password}
              />
            </label>
            <FormFieldErrors errors={passwordErrors} />
          </FormField>
          <Button>Sign Up</Button>
        </FormContent>
      </fieldset>
    </FormContainer>
    <SignViewLinks>
      <Link to="/sign-in">← I already have an account</Link>
      <Link to="/">Go back home.</Link>
    </SignViewLinks>
  </SignViewContainer>
);

export default SignUpView;