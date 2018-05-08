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
  password: string,
  errors: string[],
  emailErrors: string[],
  passwordErrors: string[],
  handleChangeEmail: Function,
  handleChangePassword: Function,
  handleSubmit: Function,
};

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
  handleSubmit,
}: Props) => (
  <AuthContainer>
    <GridLoadingOverlay gridAreaName="form" loading={loading} loadingText={loadingText} />
    <h1>Sign In</h1>
    <Form onSubmit={handleSubmit}>
      <AuthFormFieldset>
        <legend>Welcome back, User.</legend>
        <FormFieldErrors errors={errors} />
        <FormContent>
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
          <Button>Sign In</Button>
        </FormContent>
      </AuthFormFieldset>
    </Form>
    <Link to="/sign-up">I don&apos;t have an account →</Link>
    <Link to="/forgot_password">I forgot my password.</Link>
  </AuthContainer>
);

SignInView.defaultProps = {
  loadingText: 'Loading',
};

export default SignInView;
