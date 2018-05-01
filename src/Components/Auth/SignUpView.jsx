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
} from "../Styled";

const SignUpView = ({
  loading,
  email,
  username,
  password,
  errors,
  emailErrors,
  usernameErrors,
  passwordErrors,
  handleChangeEmail,
  handleChangeUsername,
  handleChangePassword,
  handleSubmit
}) => (
  <AuthContainer>
    <GridLoadingOverlay gridAreaName="form" loading={loading} />
    <h1>Sign Up</h1>
    <Form onSubmit={handleSubmit}>
      <AuthFormFieldset>
        <legend>Hello there, User.</legend>
        <FormFieldErrors errors={errors} />
        <FormContent>
          <FormField error={usernameErrors.length > 0}>
            <label htmlFor="username">Username:</label>
            <Input
              type="text"
              id="username"
              placeholder="alex"
              onChange={handleChangeUsername}
              value={username}
            />
            <FormFieldErrors errors={usernameErrors} />
          </FormField>
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
          <Button color="blue">Sign Up</Button>
        </FormContent>
      </AuthFormFieldset>
    </Form>
    <Link to="/sign-in">← I already have an account</Link>
    <Link to="/">Go back home.</Link>
  </AuthContainer>
);

SignUpView.propTypes = {
  loading: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  emailErrors: PropTypes.arrayOf(PropTypes.string).isRequired,
  usernameErrors: PropTypes.arrayOf(PropTypes.string).isRequired,
  passwordErrors: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleChangeEmail: PropTypes.func.isRequired,
  handleChangePassword: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export { SignUpView };
export default SignUpView;
