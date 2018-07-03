import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler
} from "react";
import { Link } from "react-router-dom";
import FormFieldErrors from "../PureHelpers/FormFieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import {
  Button,
  FormContainer,
  FormContent,
  FormField,
  FormInput,
  PasswordLabelFlex,
  PointerAnchor,
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
              <PasswordLabelFlex>
                <span>Password:</span>
                <PointerAnchor onClick={handleTogglePassword}>
                  <FontAwesomeIcon icon={showPassword ? "eye-slash" : "eye"} />{" "}
                  {showPassword ? "Hide Password" : "Show Password"}
                </PointerAnchor>
              </PasswordLabelFlex>
              <FormInput
                type={showPassword ? "text" : "password"}
                id="pw"
                placeholder={showPassword ? "password" : "••••••••"}
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
    <SignViewLinks>
      <Link to="/sign-up">I don&apos;t have an account →</Link>
      <Link to="/forgot-password">I forgot my password.</Link>
    </SignViewLinks>
  </SignViewContainer>
);

export default SignInView;
