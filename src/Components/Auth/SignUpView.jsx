// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import {
  GridLoadingOverlay,
  Button,
  AuthContainer,
  Form,
  FormContent,
  FormField,
  FormFieldErrors,
  AuthFormFieldset,
  Input,
} from '../Styled';

type Props = {
  loading: boolean,
  loadingText?: string,
  emailValidated: boolean,
  usernameValidated: boolean,
  passwordValidated: boolean,
  email: string,
  username: string,
  password: string,
  errors: string[],
  emailErrors: string[],
  usernameErrors: string[],
  passwordErrors: string[],
  handleChangeEmail: Function,
  handleEmailBlur: Function,
  handleChangeUsername: Function,
  handleUsernameBlur: Function,
  handleChangePassword: Function,
  handlePasswordBlur: Function,
  handleSubmit: Function,
};

const SignUpView = ({
  loading,
  loadingText,
  emailValidated,
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
  handleSubmit,
}: Props) => (
  <AuthContainer>
    <GridLoadingOverlay gridAreaName="form" loading={loading} loadingText={loadingText} />
    <h1>Sign Up</h1>
    <Form onSubmit={handleSubmit}>
      <AuthFormFieldset>
        <legend>Hello there, User.</legend>
        <FormFieldErrors errors={errors} />
        <FormContent>
          <FormField error={usernameErrors.length > 0} success={usernameValidated}>
            <label htmlFor="username">
              Username:
              <Input
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
          <FormField error={emailErrors.length > 0} success={emailValidated}>
            <label htmlFor="email">
              Email:
              <Input
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
          <FormField error={passwordErrors.length > 0} success={passwordValidated}>
            <label htmlFor="pw">
              Password:
              <Input
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
          <Button
            color="blue"
            disabled={!passwordValidated || !emailValidated || !usernameValidated}
          >
            Sign Up
          </Button>
        </FormContent>
      </AuthFormFieldset>
    </Form>
    <Link to="/sign-in">← I already have an account</Link>
    <Link to="/">Go back home.</Link>
  </AuthContainer>
);

SignUpView.defaultProps = {
  loadingText: 'Loading',
};

export default SignUpView;
