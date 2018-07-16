import React, {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler
} from "react";
import { Button } from "../PureHelpers/Button";
import FieldErrors from "../PureHelpers/FieldErrors";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import {
  FormContainer,
  FormContent,
  FormField,
  FormInput,
  SignViewContainer,
  SignViewTitle
} from "./SignViewShared";

interface IProps {
  loading: boolean;
  loadingText?: string;
  token: string;
  errors: string[];
  tokenVerifying: boolean;
  tokenVerified: boolean;
  tokenErrors: string[];
  humanizedDuration?: string;
  password: string;
  passwordValidated: boolean;
  passwordErrors: string[];
  acknowledgedLoss: boolean;
  handleChangeVerificationToken: FormEventHandler<HTMLInputElement>;
  handleCheckPasswordResetToken: FocusEventHandler<HTMLInputElement>;
  handleChangePassword: FormEventHandler<HTMLInputElement>;
  handleVerifyPassword: FocusEventHandler<HTMLInputElement>;
  handleAcknowledgedLoss: ChangeEventHandler<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

const ResetPasswordView = ({
  loading,
  loadingText,
  token,
  errors,
  tokenVerifying,
  tokenVerified,
  tokenErrors,
  humanizedDuration,
  password,
  passwordValidated,
  passwordErrors,
  acknowledgedLoss,
  handleChangeVerificationToken,
  handleCheckPasswordResetToken,
  handleChangePassword,
  handleAcknowledgedLoss,
  handleVerifyPassword,
  handleSubmit
}: IProps) => (
  <SignViewContainer>
    <GridTemplateLoadingOverlay
      loading={loading}
      loadingText={loadingText}
      gridAreaName="form"
    />
    <SignViewTitle>Reset Password</SignViewTitle>
    <FormContainer onSubmit={handleSubmit}>
      <fieldset>
        <legend>User, be careful. Ciphers are potent.</legend>
        <FieldErrors errors={errors} />
        <FormContent>
          <FormField
            error={tokenErrors.length > 0}
            success={tokenVerified}
            // warn={tokenVerifying}
          >
            <label htmlFor="resetToken">
              Token: {tokenVerifying && " \u2026"}
              {tokenVerified && " \u2713"}
              {!!humanizedDuration && ` Valid for ${humanizedDuration}.`}
              <FormInput
                type="text"
                id="resetToken"
                placeholder="username:••••••••"
                onChange={handleChangeVerificationToken}
                onBlur={handleCheckPasswordResetToken}
                autoComplete="off"
                value={token}
              />
            </label>
            <FieldErrors errors={tokenErrors} />
          </FormField>
          <FormField
            error={passwordErrors.length > 0}
            success={passwordValidated}
          >
            <label htmlFor="pw">
              Password:
              <FormInput
                type="password"
                id="pw"
                placeholder="••••••••"
                onChange={handleChangePassword}
                onBlur={handleVerifyPassword}
                value={password}
              />
            </label>
            <FieldErrors errors={passwordErrors} />
          </FormField>
          <FormField>
            <label
              htmlFor="understandReset"
              style={{
                flexDirection: "row-reverse",
                justifyContent: "flex-start",
                alignContent: "flex-start"
              }}
            >
              <FormInput
                type="checkbox"
                id="understandReset"
                checked={acknowledgedLoss}
                onChange={handleAcknowledgedLoss}
              />
              Acknowledge loss of encrypted data.
            </label>
          </FormField>
          <Button disabled={!acknowledgedLoss}>
            Force Reset Master Password
          </Button>
        </FormContent>
      </fieldset>
    </FormContainer>
  </SignViewContainer>
);

export default ResetPasswordView;
