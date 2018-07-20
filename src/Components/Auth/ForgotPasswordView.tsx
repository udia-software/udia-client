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
  email: string;
  errors: string[];
  requestSent: boolean;
  emailErrors: string[];
  handleChangeEmail: ChangeEventHandler<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

const ForgotPasswordView = ({
  loading,
  loadingText,
  email,
  errors,
  requestSent,
  emailErrors,
  handleChangeEmail,
  handleSubmit
}: IProps) => (
  <SignViewContainer>
    <GridTemplateLoadingOverlay
      loading={loading}
      loadingText={loadingText}
      gridAreaName="form"
    />
    <SignViewTitle>Forgot Password</SignViewTitle>
    <FormContainer onSubmit={handleSubmit}>
      <fieldset>
        <FormLegend>Resetting your password, User?</FormLegend>
        <FieldErrors errors={errors} />
        <FormContent>
          <FormField error={emailErrors.length > 0} success={requestSent}>
            <label htmlFor="email">
              Email:
              <FormInput
                type="email"
                id="email"
                placeholder="email@udia.ca"
                onChange={handleChangeEmail}
                autoComplete="off"
                value={email}
              />
            </label>
            <FieldSuccesses
              successes={requestSent ? ["Password reset email sent!"] : []}
            />
            <FieldErrors errors={emailErrors} />
          </FormField>
          <Button>Request Password Reset</Button>
        </FormContent>
      </fieldset>
    </FormContainer>
  </SignViewContainer>
);

export default ForgotPasswordView;
