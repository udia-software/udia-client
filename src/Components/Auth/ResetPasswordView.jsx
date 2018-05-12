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
  tokenVerifying: boolean,
  tokenVerified: boolean,
  tokenErrors: string[],
  humanizedDuration: string,
  diff: number,
  password: string,
  passwordValidated: boolean,
  passwordErrors: string[],
  acknowledgedLoss: boolean,
  acknowledgedLossError: boolean,
  handleChangeVerificationToken: Function,
  handleCheckPasswordResetToken: Function,
  handleChangePassword: Function,
  handleVerifyPassword: Function,
  handleAcknowledgedLoss: Function,
  handleSubmit: Function,
};

const ResetPasswordView = ({
  loading,
  loadingText,
  token,
  errors,
  tokenVerifying,
  tokenVerified,
  tokenErrors,
  humanizedDuration,
  diff,
  password,
  passwordValidated,
  passwordErrors,
  acknowledgedLoss,
  acknowledgedLossError,
  handleChangeVerificationToken,
  handleCheckPasswordResetToken,
  handleChangePassword,
  handleAcknowledgedLoss,
  handleVerifyPassword,
  handleSubmit,
}: Props) => (
  <AuthContainer>
    <GridLoadingOverlay gridAreaName="form" loading={loading} loadingText={loadingText} />
    <h1>Reset Password</h1>
    <Form onSubmit={handleSubmit}>
      <AuthFormFieldset>
        <legend>User, be careful. Ciphers are potent.</legend>
        <FormFieldErrors errors={errors} />
        <FormContent>
          <FormField error={tokenErrors.length > 0} success={tokenVerified} warn={tokenVerifying}>
            <label htmlFor="resetToken">
              Token: {tokenVerifying && ' \u2026'}
              {tokenVerified && ' \u2713'}
              {!!humanizedDuration && ` Valid for ${humanizedDuration}.`}
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
          <FormField error={passwordErrors.length > 0} success={passwordValidated}>
            <label htmlFor="pw">
              Password:
              <Input
                type="password"
                id="pw"
                placeholder="••••••••"
                onChange={handleChangePassword}
                onBlur={handleVerifyPassword}
                value={password}
              />
            </label>
            <FormFieldErrors errors={passwordErrors} />
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
              <Input
                type="checkbox"
                id="understandReset"
                value={acknowledgedLoss}
                onClick={handleAcknowledgedLoss}
              />
              Acknowledge loss of encrypted data.
            </label>
            {acknowledgedLossError && (
              <FormFieldErrors errors={['Forfeit all of your encrypted items.']} />
            )}
          </FormField>
          <Button color="red">Force Reset Master Password</Button>
        </FormContent>
      </AuthFormFieldset>
    </Form>
  </AuthContainer>
);

ResetPasswordView.defaultProps = {
  loadingText: 'Loading',
};

export default ResetPasswordView;
