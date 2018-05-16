// @flow
import React, { Fragment } from 'react';
import { duration, utc } from 'moment';

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
  loading: boolean,
  loadingText?: string,
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
  changeEmailSuccesses: string[],
  oldPassword: string,
  oldPasswordErrors: string[],
  newPassword: string,
  newPasswordErrors: string[],
  newPasswordValidated: boolean,
  updatePasswordSuccesses: string[],
  handleAddEmailSubmit: Function,
  handleChangeAddEmail: Function,
  handleEmailBlur: Function,
  handleResendVerification: Function,
  handleSetAsPrimary: Function,
  handleDeleteEmail: Function,
  handleNewPasswordSubmit: Function,
  handleNewPasswordBlur: Function,
  handleChangeOldPassword: Function,
  handleChangeNewPassword: Function,
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
  loading,
  loadingText,
  changeEmailSuccesses,
  oldPassword,
  oldPasswordErrors,
  newPassword,
  newPasswordErrors,
  newPasswordValidated,
  updatePasswordSuccesses,
  handleAddEmailSubmit,
  handleChangeAddEmail,
  handleEmailBlur,
  handleResendVerification,
  handleSetAsPrimary,
  handleDeleteEmail,
  handleNewPasswordSubmit,
  handleNewPasswordBlur,
  handleChangeOldPassword,
  handleChangeNewPassword,
}: Props) => (
  <Fragment>
    <GridLoadingOverlay gridAreaName="content" loading={loading} loadingText={loadingText} />
    <CenterContainer>
      <h1>My Profile</h1>
      <div>
        <dl>
          <dt style={{ textAlign: 'center', margin: '0' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateRows: '2em auto',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateAreas:
                  '"user name joined"' +
                  '". time0 ."' +
                  '". time1 ."' +
                  '". time2 ."' +
                  '". time3 ."' +
                  '". time4 ."' +
                  '". time5 ."' +
                  '". time6 ."',
              }}
            >
              <span style={{ gridArea: 'user', justifySelf: 'end' }}>User &rarr;</span>
              <span
                style={{ gridArea: 'name', justifySelf: 'center', textDecoration: 'underline' }}
              >
                {username}
              </span>
              <span style={{ gridArea: 'joined', justifySelf: 'start' }}>&larr; joined</span>
              {exactHumanCreatedAgo.split(',').map((segments, index) => (
                <span key={segments} style={{ justifySelf: 'center', gridArea: `time${index}` }}>
                  {segments}
                </span>
              ))}
            </div>
          </dt>
          <dd
            style={{
              paddingTop: '1em',
              textAlign: 'center',
              margin: '0',
            }}
          >
            ago on<br />
            {utc(createdAt)
              .local()
              .format(MOMENT_FORMAT_STRING)}
          </dd>
          {exactHumanCreatedAgo !== exactHumanUpdatedAgo && (
            <Fragment>
              <dt style={{ paddingTop: '1em', textAlign: 'center', margin: '0' }}>
                <div
                  style={{
                    display: 'grid',
                    gridAutoRows: 'auto',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gridTemplateAreas:
                      '"password . pwago"' +
                      '". time0 ."' +
                      '". time1 ."' +
                      '". time2 ."' +
                      '". time3 ."' +
                      '". time4 ."' +
                      '". time5 ."' +
                      '". time6 ."',
                    placeItems: 'center',
                    placeContent: 'center',
                  }}
                >
                  {exactHumanUpdatedAgo.split(',').map((segment, index) => (
                    <span key={segment} style={{ justifySelf: 'center', gridArea: `time${index}` }}>
                      {segment}
                    </span>
                  ))}
                  <span style={{ gridArea: 'password', justifySelf: 'center' }}>Password</span>
                  <span style={{ gridArea: 'pwago', justifySelf: 'center' }}>changed</span>
                </div>
              </dt>
              <dd style={{ paddingTop: '1em', textAlign: 'center', margin: '0' }}>
                ago on<br />
                {utc(updatedAt)
                  .local()
                  .format(MOMENT_FORMAT_STRING)}
              </dd>
            </Fragment>
          )}
        </dl>
      </div>
      <h2 style={{ paddingTop: '3em' }}>Emails</h2>
      <Form onSubmit={handleAddEmailSubmit} gridArea="">
        <AuthFormFieldset>
          <legend>Add a new email.</legend>
          <FormContent>
            <FormField error={addEmailErrors.length > 0} success={emailValidated}>
              <label htmlFor="addEmail">
                Email:
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
          <FormFieldSuccesses successes={changeEmailSuccesses} style={{ paddingBottom: '1em' }} />
          {sortedEmails.map(userEmail => (
            <div
              key={userEmail.email}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: 'auto auto',
                gridTemplateAreas: "'verified primary email' 'sendverify setprimary delete'",
                gridColumnGap: '1em',
                justifyItems: 'stretch',
                alignItems: 'stretch',
                justifyContent: 'space-betwen',
              }}
            >
              <span style={{ gridArea: 'verified', justifySelf: 'center' }}>
                {userEmail.verified
                  ? 'Verified'
                  : `Token valid for ${duration(utc().diff(utc(userEmail.verificationExpiry))).humanize()}`}
              </span>
              <span style={{ gridArea: 'primary', justifySelf: 'center' }}>
                {userEmail.primary ? 'Primary' : 'Secondary'}
              </span>
              <strong style={{ gridArea: 'email', justifySelf: 'center' }}>
                {userEmail.email}
              </strong>
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
                onClick={handleSetAsPrimary(userEmail.email)}
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
      <h2 style={{ paddingTop: '3em' }}>Change Password</h2>
      <Form onSubmit={handleNewPasswordSubmit} gridArea="">
        <AuthFormFieldset>
          <legend>Update password.</legend>
          <FormFieldSuccesses
            successes={updatePasswordSuccesses}
            style={{ paddingBottom: '1em' }}
          />
          <FormContent>
            <FormField error={oldPasswordErrors.length > 0}>
              <label htmlFor="oldPassword">
                Old Password
                <Input
                  type="password"
                  id="oldPassword"
                  onChange={handleChangeOldPassword}
                  value={oldPassword}
                />
              </label>
              <FormFieldErrors errors={oldPasswordErrors} />
            </FormField>
            <FormField error={newPasswordErrors.length > 0} success={newPasswordValidated}>
              <label htmlFor="newPassword">
                New Password
                <Input
                  type="password"
                  id="newPassword"
                  onChange={handleChangeNewPassword}
                  onBlur={handleNewPasswordBlur}
                  value={newPassword}
                />
              </label>
              <FormFieldErrors errors={newPasswordErrors} />
            </FormField>
            <Button color="yellow">Update Password</Button>
          </FormContent>
        </AuthFormFieldset>
      </Form>
    </CenterContainer>
  </Fragment>
);

ProfileControllerView.defaultProps = {
  loadingText: 'Loading...',
};

export default ProfileControllerView;
