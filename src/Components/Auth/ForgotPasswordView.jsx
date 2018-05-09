// @flow
import React from 'react';

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
  errors: string[],
  requestSent: boolean,
  emailErrors: string[],
  handleChangeEmail: Function,
  handleSubmit: Function,
};

const ForgotPasswordView = ({
  loading,
  loadingText,
  email,
  errors,
  requestSent,
  emailErrors,
  handleChangeEmail,
  handleSubmit,
}: Props) => (
  <AuthContainer>
    <GridLoadingOverlay gridAreaName="form" loading={loading} loadingText={loadingText} />
    <h1>Forgot Password</h1>
    <Form onSubmit={handleSubmit}>
      <AuthFormFieldset>
        <legend>Resetting your password, User?</legend>
        <FormFieldErrors errors={errors} />
        <FormContent>
          <FormField error={emailErrors.length > 0} success={requestSent}>
            <label htmlFor="email">
              Email:
              <Input
                type="email"
                id="email"
                placeholder="email@udia.ca"
                onChange={handleChangeEmail}
                autoComplete="off"
                value={email}
              />
            </label>
            {requestSent && 'Password reset email sent!'}
            <FormFieldErrors errors={emailErrors} />
          </FormField>
          <Button color="yellow">Request Password Reset</Button>
        </FormContent>
      </AuthFormFieldset>
    </Form>
  </AuthContainer>
);

ForgotPasswordView.defaultProps = {
  loadingText: 'Loading',
};

export default ForgotPasswordView;
