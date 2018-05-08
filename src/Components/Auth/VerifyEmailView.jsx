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
  token: string,
  errors: string[],
  tokenErrors: string[],
  handleChangeVerificationToken: Function,
  handleSubmit: Function,
};

const VerifyEmailView = ({
  loading,
  loadingText,
  token,
  errors,
  tokenErrors,
  handleChangeVerificationToken,
  handleSubmit,
}: Props) => (
  <AuthContainer>
    <GridLoadingOverlay gridAreaName="form" loading={loading} loadingText={loadingText} />
    <h1>Verify Email</h1>
    <Form onSubmit={handleSubmit}>
      <AuthFormFieldset>
        <legend>Confirm your email, User.</legend>
        <FormFieldErrors errors={errors} />
        <FormContent>
          <FormField error={tokenErrors.length > 0}>
            <label htmlFor="username">
              Token:
              <Input
                type="text"
                id="username"
                placeholder="email@udia.ca:••••••••"
                onChange={handleChangeVerificationToken}
                autoComplete="off"
                value={token}
              />
            </label>
            <FormFieldErrors errors={tokenErrors} />
          </FormField>
          <Button color="blue">Verify Email Token</Button>
        </FormContent>
      </AuthFormFieldset>
    </Form>
  </AuthContainer>
);

VerifyEmailView.defaultProps = {
  loadingText: 'Loading',
};

export default VerifyEmailView;
