import React, { ChangeEventHandler, FormEventHandler } from "react";
import { Button } from "../Helpers/Button";
import FieldErrors from "../Helpers/FieldErrors";
import FieldSuccesses from "../Helpers/FieldSuccesses";
import GridTemplateLoadingOverlay from "../Helpers/GridTemplateLoadingOverlay";
import {
  FormContainer,
  FormContent,
  FormField,
  FormInput,
  FormLegend,
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
        <FormLegend>Confirm your email, User.</FormLegend>
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
