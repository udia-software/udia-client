import React, { Component } from "react";
import { connect } from "react-redux";
import { utc } from "moment";

import { CenterContainer } from "Components/Styled";
import { authSelectors } from "Modules/Auth";

class ProfileController extends Component {
  render() {
    const { username, createdAt, updatedAt, email, emailVerified } = this.props;
    const MOMENT_FORMAT_STRING = "dddd, MMMM Do YYYY, h:mm:ss a";
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
          <dt>Email</dt>
          <dd>{email}</dd>
          <dt>Email Verified</dt>
          <dd>{"" + emailVerified}</dd>
        </dl>
      </CenterContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    username: authSelectors.getSelfUsername(state),
    createdAt: authSelectors.getSelfCreatedAt(state),
    updatedAt: authSelectors.getSelfUpdatedAt(state),
    email: authSelectors.getSelfEmail(state),
    emailVerified: authSelectors.getSelfEmailVerified(state)
  };
}

const Profile = connect(mapStateToProps)(ProfileController);

export { Profile };
export default Profile;
