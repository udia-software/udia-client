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
  tokenVerified: boolean,
  tokenErrors: string[],
  handleChangeVerificationToken: Function,
  handleSubmit: Function,
};

const VerifyEmailView = ({
  loading,
  loadingText,
  token,
  errors,
  tokenVerified,
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
          <FormField error={tokenErrors.length > 0} success={tokenVerified}>
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
            {tokenVerified && 'Token successfully verified!'}
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
