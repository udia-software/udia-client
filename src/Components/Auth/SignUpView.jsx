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
  email: string,
  username: string,
  password: string,
  errors: string[],
  emailErrors: string[],
  usernameErrors: string[],
  passwordErrors: string[],
  handleChangeEmail: Function,
  handleChangeUsername: Function,
  handleChangePassword: Function,
  handleSubmit: Function,
};

const SignUpView = ({
  loading,
  loadingText,
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
          <FormField error={usernameErrors.length > 0}>
            <label htmlFor="username">
              Username:
              <Input
                type="text"
                id="username"
                placeholder="alex"
                onChange={handleChangeUsername}
                value={username}
              />
            </label>
            <FormFieldErrors errors={usernameErrors} />
          </FormField>
          <FormField error={emailErrors.length > 0}>
            <label htmlFor="email">
              Email:
              <Input
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
              <Input
                type="password"
                id="pw"
                placeholder="••••••••"
                onChange={handleChangePassword}
                value={password}
              />
            </label>
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

SignUpView.defaultProps = {
  loadingText: 'Loading',
};

export default SignUpView;
