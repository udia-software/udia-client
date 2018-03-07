import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
  GridLoadingOverlay,
  StyledAuthButton,
  StyledAuthContainer,
  StyledAuthForm,
  StyledAuthFormContent,
  StyledAuthFormField,
  StyledAuthFormFieldErrors,
  StyledAuthFormFieldset,
  StyledInput
} from "Components/Styled";

const SignInView = ({
  loading,
  email,
  password,
  errors,
  emailErrors,
  passwordErrors,
  handleChangeEmail,
  handleChangePassword,
  handleSubmit
}) => {
  return (
    <StyledAuthContainer>
      <GridLoadingOverlay gridAreaName="form" loading={loading} />
      <h1>Sign In</h1>
      <StyledAuthForm onSubmit={handleSubmit}>
        <StyledAuthFormFieldset>
          <legend>Welcome back, User.</legend>
          <StyledAuthFormFieldErrors errors={errors} />
          <StyledAuthFormContent>
            <StyledAuthFormField>
              <label htmlFor="email">Email:</label>
              <StyledInput
                type="email"
                id="email"
                placeholder="your@email.tld"
                onChange={handleChangeEmail}
                value={email}
              />
              <StyledAuthFormFieldErrors errors={emailErrors} />
            </StyledAuthFormField>
            <StyledAuthFormField>
              <label htmlFor="pw">Password:</label>
              <StyledInput
                type="password"
                id="pw"
                placeholder="••••••••"
                onChange={handleChangePassword}
                value={password}
              />
              <StyledAuthFormFieldErrors errors={passwordErrors} />
            </StyledAuthFormField>
            <StyledAuthButton>Sign In</StyledAuthButton>
          </StyledAuthFormContent>
        </StyledAuthFormFieldset>
      </StyledAuthForm>
      <Link to="/sign-up">I don't have an account →</Link>
      <Link to="/forgot_password">I forgot my password.</Link>
    </StyledAuthContainer>
  );
};

SignInView.propTypes = {
  loading: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  emailErrors: PropTypes.arrayOf(PropTypes.string).isRequired,
  passwordErrors: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleChangeEmail: PropTypes.func.isRequired,
  handleChangePassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export { SignInView };
export default SignInView;
