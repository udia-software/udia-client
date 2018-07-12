import React, {
  ChangeEventHandler,
  FocusEventHandler,
  FormEventHandler,
  Fragment,
  MouseEventHandler
} from "react";
import FieldErrors from "../PureHelpers/FieldErrors";
import FieldSuccesses from "../PureHelpers/FieldSuccesses";
import GridTemplateLoadingOverlay from "../PureHelpers/GridTemplateLoadingOverlay";
import {
  Button,
  FormContainer,
  FormContent,
  FormField,
  FormInput,
  PointerAnchor,
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
          <legend>Adding a new email, {user.username}?</legend>
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
                    <PointerAnchor onClick={handleRemoveEmail(email)}>
                      Remove Email
                    </PointerAnchor>
                    {verified ? (
                      undefined
                    ) : (
                      <Fragment>
                        {" | "}
                        <PointerAnchor
                          onClick={handleSendEmailVerification(email)}
                        >
                          Resend Verification
                        </PointerAnchor>
                      </Fragment>
                    )}
                    {primary ? (
                      undefined
                    ) : (
                      <Fragment>
                        {" | "}
                        <PointerAnchor onClick={handleSetPrimaryEmail(email)}>
                          Set Primary
                        </PointerAnchor>
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
