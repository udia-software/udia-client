// @flow
import React, { Fragment } from 'react';
import { utc } from 'moment';

import {
  Button,
  CenterContainer,
  AuthFormFieldset,
  Form,
  FormFieldErrors,
  FormFieldSuccesses,
  Input,
  FormContent,
  FormField,
  GridLoadingOverlay,
} from '../Styled';

type Props = {
  username: string,
  createdAt: Date,
  updatedAt: Date,
  sortedEmails: any[],
  exactHumanCreatedAgo: string,
  exactHumanUpdatedAgo: string,
  errors: string[],
  addEmailInput: string,
  addEmailErrors: string[],
  emailValidated: boolean,
  changingEmails: boolean,
  changeEmailSuccesses: string[],
  handleAddEmailSubmit: Function,
  handleChangeAddEmail: Function,
  handleEmailBlur: Function,
  handleResendVerification: Function,
  handleSetAsPrimary: Function,
  handleDeleteEmail: Function,
};

const MOMENT_FORMAT_STRING = 'dddd, MMMM Do YYYY, h:mm:ss a';

const ProfileControllerView = ({
  username,
  createdAt,
  updatedAt,
  sortedEmails,
  exactHumanCreatedAgo,
  exactHumanUpdatedAgo,
  errors,
  addEmailInput,
  addEmailErrors,
  emailValidated,
  changingEmails,
  changeEmailSuccesses,
  handleAddEmailSubmit,
  handleChangeAddEmail,
  handleEmailBlur,
  handleResendVerification,
  handleSetAsPrimary,
  handleDeleteEmail,
}: Props) => (
  <Fragment>
    <GridLoadingOverlay gridAreaName="content" loading={changingEmails} />
    <CenterContainer>
      <h1>My Profile</h1>
      <dl>
        <dt>Username</dt>
        <dd>{username}</dd>
        <dt>Joined UDIA {exactHumanCreatedAgo} ago.</dt>
        <dd>{utc(createdAt).format(MOMENT_FORMAT_STRING)}</dd>
        <dt>Password last changed {exactHumanUpdatedAgo} ago.</dt>
        <dd>{utc(updatedAt).format(MOMENT_FORMAT_STRING)}</dd>
      </dl>
      <h3>Emails</h3>
      <Form onSubmit={handleAddEmailSubmit} gridArea="">
        <AuthFormFieldset>
          <legend>Add a new email.</legend>
          <FormContent>
            <FormField
              error={addEmailErrors.length > 0}
              success={emailValidated}
              warn={changingEmails}
            >
              <label htmlFor="addEmail">
                Email:{changingEmails && ' \u2026'}
                <Input
                  type="email"
                  id="addEmail"
                  onChange={handleChangeAddEmail}
                  onBlur={handleEmailBlur}
                  value={addEmailInput}
                />
              </label>
              <FormFieldErrors errors={addEmailErrors} />
            </FormField>
            <Button color="green">Add Email</Button>
          </FormContent>
        </AuthFormFieldset>
        <AuthFormFieldset>
          <FormFieldErrors errors={errors} />
          <FormFieldSuccesses successes={changeEmailSuccesses} />
          {sortedEmails.map(userEmail => (
            <div
              key={userEmail.email}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '1em auto',
                gridTemplateAreas: "'email primary verified' 'sendverify setprimary delete'",
                gridColumnGap: '1em',
                justifyItems: 'stretch',
                alignItems: 'stretch',
                justifyContent: 'space-betwen',
              }}
            >
              <strong style={{ gridArea: 'email', justifySelf: 'center' }}>
                {userEmail.email}
              </strong>
              <span style={{ gridArea: 'primary', justifySelf: 'center' }}>
                {userEmail.primary ? 'Primary' : 'Secondary'}
              </span>
              <span style={{ gridArea: 'verified', justifySelf: 'center' }}>
                {userEmail.verified ? 'Verified' : 'Not Verified'}
              </span>
              <Button
                style={{ gridArea: 'sendverify', justifySelf: 'center' }}
                size="mini"
                disabled={userEmail.verified}
                onClick={handleResendVerification(userEmail.email)}
              >
                {userEmail.verified ? 'Is Verified' : 'Resend Verification'}
              </Button>
              <Button
                style={{ gridArea: 'setprimary', justifySelf: 'center' }}
                size="mini"
                disabled={userEmail.primary}
                onClick={handleSetAsPrimary}
              >
                {userEmail.primary ? 'Is primary' : 'Set as Primary'}
              </Button>
              <Button
                style={{ gridArea: 'delete', justifySelf: 'center' }}
                size="mini"
                color="red"
                onClick={handleDeleteEmail(userEmail.email)}
              >
                Delete Email
              </Button>
            </div>
          ))}
        </AuthFormFieldset>
      </Form>
    </CenterContainer>
  </Fragment>
);

export default ProfileControllerView;
