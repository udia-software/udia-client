import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler
} from "react";
import FormFieldErrors from "../PureHelpers/FormFieldErrors";
import FormFieldSuccesses from "../PureHelpers/FormFieldSuccesses";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import {
  Button,
  FormContainer,
  FormContent,
  FormField,
  FormInput,
  PasswordLabelFlex,
  PointerAnchor,
  SignViewContainer,
  SignViewTitle
} from "./SignViewShared";

interface IProps {
  loading: boolean;
  loadingText?: string;
  currentPassword: string;
  newPassword: string;
  newPasswordValidated: boolean;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  errors: string[];
  success: boolean;
  currentPasswordErrors: string[];
  newPasswordErrors: string[];
  handleToggleCurrentPassword: MouseEventHandler<HTMLAnchorElement>;
  handleToggleNewPassword: MouseEventHandler<HTMLAnchorElement>;
  handleChangeCurrentPassword: ChangeEventHandler<HTMLInputElement>;
  handleChangeNewPassword: ChangeEventHandler<HTMLInputElement>;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

const UpdatePasswordView = ({
  loading,
  loadingText,
  currentPassword,
  newPassword,
  showCurrentPassword,
  showNewPassword,
  newPasswordValidated,
  errors,
  success,
  currentPasswordErrors,
  newPasswordErrors,
  handleToggleCurrentPassword,
  handleToggleNewPassword,
  handleChangeCurrentPassword,
  handleChangeNewPassword,
  handleSubmit
}: IProps) => {
  return (
    <SignViewContainer>
      <GridTemplateLoadingOverlay
        gridAreaName="form"
        loading={loading}
        loadingText={loadingText}
      />
      <SignViewTitle>Update password</SignViewTitle>
      <FormContainer onSubmit={handleSubmit}>
        <fieldset>
          <legend>Changing your password, User?</legend>
          <FormFieldErrors errors={errors} />
          <FormContent>
            <FormField error={currentPasswordErrors.length > 0}>
              <label htmlFor="currentPassword">
                <PasswordLabelFlex>
                  <span>Current Password:</span>
                  <PointerAnchor onClick={handleToggleCurrentPassword}>
                    <FontAwesomeIcon
                      icon={showCurrentPassword ? "eye-slash" : "eye"}
                    />{" "}
                    {showCurrentPassword ? "Hide Password" : "Show Password"}
                  </PointerAnchor>
                </PasswordLabelFlex>
                <FormInput
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  placeholder={showCurrentPassword ? "password" : "••••••••"}
                  onChange={handleChangeCurrentPassword}
                  // onBlur={handleCurrentPasswordBlur}
                  value={currentPassword}
                />
              </label>
              <FormFieldErrors errors={currentPasswordErrors} />
            </FormField>
            <FormField
              error={newPasswordErrors.length > 0}
              success={newPasswordValidated}
            >
              <label htmlFor="pw">
                <PasswordLabelFlex>
                  <span>New Password:{newPasswordValidated && " \u2714"}</span>
                  <PointerAnchor onClick={handleToggleNewPassword}>
                    <FontAwesomeIcon
                      icon={showNewPassword ? "eye-slash" : "eye"}
                    />{" "}
                    {showNewPassword ? "Hide Password" : "Show Password"}
                  </PointerAnchor>
                </PasswordLabelFlex>
                <FormInput
                  type={showNewPassword ? "text" : "password"}
                  id="pw"
                  placeholder={showNewPassword ? "password" : "••••••••"}
                  onChange={handleChangeNewPassword}
                  // onBlur={handleNewPasswordBlur}
                  value={newPassword}
                />
              </label>
              <FormFieldErrors errors={newPasswordErrors} />
              <FormFieldSuccesses
                successes={success ? ["Successfully updated password!"] : []}
              />
            </FormField>
            <Button>Update Password</Button>
          </FormContent>
        </fieldset>
      </FormContainer>
    </SignViewContainer>
  );
};

export default UpdatePasswordView;
