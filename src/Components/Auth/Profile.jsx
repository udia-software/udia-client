import React, { Component } from "react";
import { connect } from "react-redux";

import { CenterContainer } from "Components/Styled";

class ProfileController extends Component {
  render() {
    const { me } = this.props;
    console.log(me);
    return (
      <CenterContainer>
        <h1>My Profile</h1>
      </CenterContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    me: state.auth.authUser
  };
}

const Profile = connect(mapStateToProps)(ProfileController);

export { Profile };
export default Profile;
