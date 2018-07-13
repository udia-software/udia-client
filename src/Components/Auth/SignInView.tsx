import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ChangeEventHandler,
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
  email: string;
  password: string;
  errors: string[];
  emailErrors: string[];
  passwordErrors: string[];
  showPassword: boolean;
  handleChangeEmail: ChangeEventHandler<HTMLInputElement>;
  handleChangePassword: ChangeEventHandler<HTMLInputElement>;
  handleTogglePassword: MouseEventHandler<HTMLAnchorElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

const SignInView = ({
  loading,
  loadingText,
  email,
  password,
  errors,
  emailErrors,
  passwordErrors,
  showPassword,
  handleChangeEmail,
  handleChangePassword,
  handleTogglePassword,
  handleSubmit
}: IProps) => (
  <SignViewContainer>
    <GridTemplateLoadingOverlay
      loading={loading}
      loadingText={loadingText}
      gridAreaName="form"
    />
    <SignViewTitle>Sign In</SignViewTitle>
    <FormContainer onSubmit={handleSubmit}>
      <fieldset>
        <legend>Welcome back, User.</legend>
        <FieldErrors errors={errors} />
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
            <FieldErrors errors={emailErrors} />
          </FormField>
          <FormField error={passwordErrors.length > 0}>
            <label htmlFor="pw">
              <PasswordLabelFlex>
                <span>Password:</span>
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
                value={password}
              />
            </label>
            <FieldErrors errors={passwordErrors} />
          </FormField>
          <Button>Sign In</Button>
        </FormContent>
      </fieldset>
    </FormContainer>
    <SignViewLinks>
      <ThemedLink to="/sign-up">I don&apos;t have an account →</ThemedLink>
      <ThemedLink to="/forgot-password">I forgot my password.</ThemedLink>
    </SignViewLinks>
  </SignViewContainer>
);

export default SignInView;
