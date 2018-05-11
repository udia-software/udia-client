// @flow
import { utc, duration } from 'moment';
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
  tokenVerifying: boolean,
  tokenVerified: boolean,
  tokenExpiry?: number,
  tokenErrors: string[],
  handleChangeVerificationToken: Function,
  handleCheckPasswordResetToken: Function,
  handleSubmit: Function,
};

const ResetPasswordView = ({
  loading,
  loadingText,
  token,
  errors,
  tokenVerifying,
  tokenVerified,
  tokenExpiry,
  tokenErrors,
  handleChangeVerificationToken,
  handleCheckPasswordResetToken,
  handleSubmit,
}: Props) => {
  let humanizedDuration = '';
  if (tokenExpiry) {
    humanizedDuration = duration(utc(tokenExpiry).diff(utc())).humanize(true);
  }
  return (
    <AuthContainer>
      <GridLoadingOverlay gridAreaName="form" loading={loading} loadingText={loadingText} />
      <h1>Reset Password</h1>
      <Form onSubmit={handleSubmit}>
        <AuthFormFieldset>
          <legend>User, be careful.</legend>
          <FormFieldErrors errors={errors} />
          <FormContent>
            <FormField error={tokenErrors.length > 0} success={tokenVerified} warn={tokenVerifying}>
              <label htmlFor="resetToken">
                Token: {tokenVerifying && ' \u2026'}
                {tokenVerified && ` \u2713 Token expires ${humanizedDuration}.`}
                <Input
                  type="text"
                  id="resetToken"
                  placeholder="username:••••••••"
                  onChange={handleChangeVerificationToken}
                  onBlur={handleCheckPasswordResetToken}
                  autoComplete="off"
                  value={token}
                />
              </label>
              <FormFieldErrors errors={tokenErrors} />
            </FormField>
            <FormField>
              <label
                htmlFor="understandReset"
                style={{
                  flexDirection: 'row-reverse',
                  justifyContent: 'flex-start',
                  alignContent: 'flex-start',
                }}
              >
                <Input type="checkbox" id="understandReset" />
                <span>Acknowledge loss of encrypted data.</span>
              </label>
            </FormField>
            <Button color="red">Force Reset Master Password</Button>
          </FormContent>
        </AuthFormFieldset>
      </Form>
    </AuthContainer>
  );
};

ResetPasswordView.defaultProps = {
  loadingText: 'Loading',
  tokenExpiry: undefined,
};

export default ResetPasswordView;
