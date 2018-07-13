import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  ChangeEventHandler,
  FormEventHandler,
  MouseEventHandler
} from "react";
import { Button } from "../PureHelpers/Button";
import FieldErrors from "../PureHelpers/FieldErrors";
import FieldSuccesses from "../PureHelpers/FieldSuccesses";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import { ThemedAnchor } from "../PureHelpers/ThemedLinkAnchor";
import {
  FormContainer,
  FormContent,
  FormField,
  FormInput,
  PasswordLabelFlex,
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
      <SignViewTitle>Update Password</SignViewTitle>
      <FormContainer onSubmit={handleSubmit}>
        <fieldset>
          <legend>Changing your password, User?</legend>
          <FieldErrors errors={errors} />
          <FormContent>
            <FormField error={currentPasswordErrors.length > 0}>
              <label htmlFor="currentPassword">
                <PasswordLabelFlex>
                  <span>Current Password:</span>
                  <ThemedAnchor onClick={handleToggleCurrentPassword}>
                    <FontAwesomeIcon
                      icon={showCurrentPassword ? "eye-slash" : "eye"}
                    />{" "}
                    {showCurrentPassword ? "Hide Password" : "Show Password"}
                  </ThemedAnchor>
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
              <FieldErrors errors={currentPasswordErrors} />
            </FormField>
            <FormField
              error={newPasswordErrors.length > 0}
              success={newPasswordValidated}
            >
              <label htmlFor="pw">
                <PasswordLabelFlex>
                  <span>New Password:{newPasswordValidated && " \u2714"}</span>
                  <ThemedAnchor onClick={handleToggleNewPassword}>
                    <FontAwesomeIcon
                      icon={showNewPassword ? "eye-slash" : "eye"}
                    />{" "}
                    {showNewPassword ? "Hide Password" : "Show Password"}
                  </ThemedAnchor>
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
              <FieldErrors errors={newPasswordErrors} />
              <FieldSuccesses
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
