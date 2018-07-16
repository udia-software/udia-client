import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler,
  MouseEventHandler
} from "react";
import { Button } from "../PureHelpers/Button";
import FieldErrors from "../PureHelpers/FieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import { ThemedAnchor, ThemedLink } from "../PureHelpers/ThemedLinkAnchor";
import {
  FormContainer,
  FormContent,
  FormField,
  FormInput,
  PasswordLabelFlex,
  SignViewContainer,
  SignViewLinks,
  SignViewTitle
} from "./SignViewShared";

interface IProps {
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
  showPassword: boolean;
  handleChangeEmail: ChangeEventHandler<HTMLInputElement>;
  handleEmailBlur: FocusEventHandler<HTMLInputElement>;
  handleChangeUsername: ChangeEventHandler<HTMLInputElement>;
  handleUsernameBlur: FocusEventHandler<HTMLInputElement>;
  handleChangePassword: ChangeEventHandler<HTMLInputElement>;
  handlePasswordBlur: FocusEventHandler<HTMLInputElement>;
  handleTogglePassword: MouseEventHandler<HTMLAnchorElement>;
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
  showPassword,
  handleChangeEmail,
  handleEmailBlur,
  handleChangeUsername,
  handleUsernameBlur,
  handleChangePassword,
  handlePasswordBlur,
  handleTogglePassword,
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
        <FieldErrors errors={errors} />
        <FormContent>
          <FormField
            error={usernameErrors.length > 0}
            success={usernameValidated}
            // warn={usernameValidating}
          >
            <label htmlFor="username">
              Username:{usernameValidating && " \u2026"}
              {usernameValidated && " \u2714"}
              <FormInput
                type="text"
                id="username"
                placeholder="alex"
                onChange={handleChangeUsername}
                onBlur={handleUsernameBlur}
                value={username}
              />
            </label>
            <FieldErrors errors={usernameErrors} />
          </FormField>
          <FormField
            error={emailErrors.length > 0}
            success={emailValidated}
            // warn={emailValidating}
          >
            <label htmlFor="email">
              Email:{emailValidating && " \u2026"}
              {emailValidated && " \u2714"}
              <FormInput
                type="email"
                id="email"
                placeholder="your@email.tld"
                onChange={handleChangeEmail}
                onBlur={handleEmailBlur}
                value={email}
              />
            </label>
            <FieldErrors errors={emailErrors} />
          </FormField>
          <FormField
            error={passwordErrors.length > 0}
            success={passwordValidated}
          >
            <label htmlFor="pw">
              <PasswordLabelFlex>
                <span>Password:{passwordValidated && " \u2714"}</span>
                <ThemedAnchor onClick={handleTogglePassword}>
                  <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />{" "}
                  {showPassword ? "Hide Password" : "Show Password"}
                </ThemedAnchor>
              </PasswordLabelFlex>
              <FormInput
                type={showPassword ? "text" : "password"}
                id="pw"
                placeholder={showPassword ? "password" : "••••••••"}
                onChange={handleChangePassword}
                // onBlur={handlePasswordBlur}
                value={password}
              />
            </label>
            <FieldErrors errors={passwordErrors} />
          </FormField>
          <Button>Sign Up</Button>
        </FormContent>
      </fieldset>
    </FormContainer>
    <SignViewLinks>
      <ThemedLink to="/sign-in">← I already have an account</ThemedLink>
      <ThemedLink to="/">Go back home.</ThemedLink>
    </SignViewLinks>
  </SignViewContainer>
);

export default SignUpView;
