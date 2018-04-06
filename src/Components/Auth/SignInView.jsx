import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import {
  GridLoadingOverlay,
  Button,
  AuthContainer,
  Form,
  FormContent,
  FormField,
  FormFieldErrors,
  AuthFormFieldset,
  Input
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
}) => (
  <AuthContainer>
    <GridLoadingOverlay gridAreaName="form" loading={loading} />
    <h1>Sign In</h1>
    <Form onSubmit={handleSubmit}>
      <AuthFormFieldset>
        <legend>Welcome back, User.</legend>
        <FormFieldErrors errors={errors} />
        <FormContent>
          <FormField error={emailErrors.length > 0}>
            <label htmlFor="email">Email:</label>
            <Input
              type="email"
              id="email"
              placeholder="your@email.tld"
              onChange={handleChangeEmail}
              value={email}
            />
            <FormFieldErrors errors={emailErrors} />
          </FormField>
          <FormField error={passwordErrors.length > 0}>
            <label htmlFor="pw">Password:</label>
            <Input
              type="password"
              id="pw"
              placeholder="••••••••"
              onChange={handleChangePassword}
              value={password}
            />
            <FormFieldErrors errors={passwordErrors} />
          </FormField>
          <Button>Sign In</Button>
        </FormContent>
      </AuthFormFieldset>
    </Form>
    <Link to="/sign-up">I don't have an account →</Link>
    <Link to="/forgot_password">I forgot my password.</Link>
  </AuthContainer>
);

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
