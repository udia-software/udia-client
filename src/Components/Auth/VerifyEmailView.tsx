import React, { ChangeEventHandler, FormEventHandler } from "react";
import { Button } from "../PureHelpers/Button";
import FieldErrors from "../PureHelpers/FieldErrors";
import FieldSuccesses from "../PureHelpers/FieldSuccesses";
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
  tokenVerified: boolean;
  tokenErrors: string[];
  handleChangeVerificationToken: ChangeEventHandler<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

const VerifyEmailView = ({
  loading,
  loadingText,
  token,
  errors,
  tokenVerified,
  tokenErrors,
  handleChangeVerificationToken,
  handleSubmit
}: IProps) => (
  <SignViewContainer>
    <GridTemplateLoadingOverlay
      loading={loading}
      loadingText={loadingText}
      gridAreaName="form"
    />
    <SignViewTitle>Verify Email</SignViewTitle>
    <FormContainer onSubmit={handleSubmit}>
      <fieldset>
        <legend>Confirm your email, User.</legend>
        <FieldErrors errors={errors} />
        <FormContent>
          <FormField error={tokenErrors.length > 0} success={tokenVerified}>
            <label htmlFor="emailToken">
              Token:
              <FormInput
                type="text"
                id="emailToken"
                placeholder="email@udia.ca:••••••••"
                onChange={handleChangeVerificationToken}
                autoComplete="off"
                value={token}
              />
            </label>
            <FieldSuccesses
              successes={tokenVerified ? ["Token successfully verified!"] : []}
            />
            <FieldErrors errors={tokenErrors} />
          </FormField>
          <Button>Verify Email Token</Button>
        </FormContent>
      </fieldset>
    </FormContainer>
  </SignViewContainer>
);

export default VerifyEmailView;
