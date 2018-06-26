import React, { ChangeEventHandler, FormEventHandler } from "react";
import Button from "../PureHelpers/Button";
import FormField from "../PureHelpers/FormField";
import FormFieldErrors from "../PureHelpers/FormFieldErrors";
import FormFieldSuccesses from "../PureHelpers/FormFieldSuccesses";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import {
  FormContainer,
  FormContent,
  FormInput,
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
        <legend>Resetting your password, User?</legend>
        <FormFieldErrors errors={errors} />
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
            <FormFieldSuccesses
              successes={requestSent ? ["Password reset email sent!"] : []}
            />
            <FormFieldErrors errors={emailErrors} />
          </FormField>
          <Button>Request Password Reset</Button>
        </FormContent>
      </fieldset>
    </FormContainer>
  </SignViewContainer>
);

export default ForgotPasswordView;
