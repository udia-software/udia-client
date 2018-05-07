// @flow
import React from 'react';
import { connect } from 'react-redux';
import { utc } from 'moment';

import { CenterContainer } from '../Styled';
import { AuthSelectors } from '../../Modules/Auth';

type Props = {
  username: string,
  createdAt: Date,
  updatedAt: Date,
  emails: any[],
};

const ProfileController = (props: Props) => {
  const {
    username, createdAt, updatedAt, emails,
  } = props;
  const MOMENT_FORMAT_STRING = 'dddd, MMMM Do YYYY, h:mm:ss a';
  console.log(emails);
  return (
    <CenterContainer>
      <h1>My Profile</h1>
      <dl>
        <dt>Username</dt>
        <dd>{username}</dd>
        <dt>Created At</dt>
        <dd>{utc(createdAt).format(MOMENT_FORMAT_STRING)}</dd>
        <dt>Updated At</dt>
        <dd>{utc(updatedAt).format(MOMENT_FORMAT_STRING)}</dd>
      </dl>
      <h3>Emails</h3>
      {emails.reduce(
        (acc, item) =>
          acc.concat([
            <strong key={`email-${item.email}`}>{item.email}</strong>,
            <dl key={`dl-${item.email}`}>
              <dt key={`primary-${item.email}`}>Primary</dt>
              <dd key={`primary-data-${item.email}`}>{JSON.stringify(item.primary)}</dd>
              <dt key={`verified-${item.email}`}>Verified</dt>
              <dd key={`verified-data-${item.email}`}>{JSON.stringify(item.verified)}</dd>
            </dl>,
          ]),
        [],
      )}
    </CenterContainer>
  );
};

function mapStateToProps(state) {
  return {
    username: AuthSelectors.getSelfUsername(state),
    createdAt: AuthSelectors.getSelfCreatedAt(state),
    updatedAt: AuthSelectors.getSelfUpdatedAt(state),
    emails: AuthSelectors.getSelfEmails(state),
  };
}

export default connect(mapStateToProps)(ProfileController);
