import React, {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler,
  Fragment,
  MouseEventHandler
} from "react";
import { Button } from "../Helpers/Button";
import FieldErrors from "../Helpers/FieldErrors";
import FieldSuccesses from "../Helpers/FieldSuccesses";
import GridTemplateLoadingOverlay from "../Helpers/GridTemplateLoadingOverlay";
import { ThemedAnchor } from "../Helpers/ThemedLinkAnchor";
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
  emailValidating: boolean;
  emailSuccess: boolean | string;
  formEmail: string;
  user: FullUser;
  errors: string[];
  formEmailErrors: string[];
  userEmailErrors: string[];
  handleChangeEmail: ChangeEventHandler<HTMLInputElement>;
  handleEmailBlur: FocusEventHandler<HTMLInputElement>;
  handleAddEmail: FormEventHandler<HTMLFormElement>;
  handleRemoveEmail: (email: string) => MouseEventHandler<HTMLAnchorElement>;
  handleSetPrimaryEmail: (
    email: string
  ) => MouseEventHandler<HTMLAnchorElement>;
  handleSendEmailVerification: (
    email: string
  ) => MouseEventHandler<HTMLAnchorElement>;
}

const UserEmailView = ({
  loading,
  loadingText,
  emailValidating,
  formEmail,
  user,
  errors,
  formEmailErrors,
  userEmailErrors,
  emailSuccess,
  handleChangeEmail,
  handleEmailBlur,
  handleAddEmail,
  handleRemoveEmail,
  handleSetPrimaryEmail,
  handleSendEmailVerification
}: IProps) => {
  return (
    <SignViewContainer>
      <GridTemplateLoadingOverlay
        gridAreaName="form"
        loading={loading}
        loadingText={loadingText}
      />
      <SignViewTitle>Emails</SignViewTitle>
      <FormContainer onSubmit={handleAddEmail}>
        <fieldset>
          <FormLegend>Adding a new email, {user.username}?</FormLegend>
          <FieldErrors errors={errors} />
          <FormContent>
            <FormField
              error={formEmailErrors.length > 0}
              success={!!emailSuccess}
            >
              <label htmlFor="email">
                Email:{emailValidating && " \u2026"}
                <FormInput
                  type="email"
                  id="email"
                  placeholder="your@email.tld"
                  onChange={handleChangeEmail}
                  onBlur={handleEmailBlur}
                  value={formEmail}
                />
              </label>
              <FieldErrors errors={formEmailErrors} />
              <FieldSuccesses
                successes={
                  typeof emailSuccess === "string" ? [emailSuccess] : []
                }
              />
            </FormField>
            <Button>Add Email</Button>
          </FormContent>
          <h3 style={{ marginBottom: 0, textAlign: "center" }}>User Emails</h3>
          <FieldErrors errors={userEmailErrors} />
          <dl>
            {user.emails.map(
              ({ email, primary, verified, verificationExpiry }, index) => (
                <Fragment key={email}>
                  {index ? <hr /> : undefined}
                  <dt>
                    <strong>{email}</strong>
                    {primary ? " • primary" : undefined}
                    {verified ? " • verified" : " • not verified"}
                  </dt>
                  <dd style={{ marginLeft: "1em", paddingTop: "0.2em" }}>
                    <ThemedAnchor onClick={handleRemoveEmail(email)}>
                      Remove Email
                    </ThemedAnchor>
                    {verified ? (
                      undefined
                    ) : (
                      <Fragment>
                        {" | "}
                        <ThemedAnchor
                          onClick={handleSendEmailVerification(email)}
                        >
                          Resend Verification
                        </ThemedAnchor>
                      </Fragment>
                    )}
                    {primary ? (
                      undefined
                    ) : (
                      <Fragment>
                        {" | "}
                        <ThemedAnchor onClick={handleSetPrimaryEmail(email)}>
                          Set Primary
                        </ThemedAnchor>
                      </Fragment>
                    )}
                  </dd>
                </Fragment>
              )
            )}
          </dl>
        </fieldset>
      </FormContainer>
    </SignViewContainer>
  );
};

export default UserEmailView;
