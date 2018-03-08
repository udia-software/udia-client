import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { authActions } from "Modules/Auth";
import { Button, CenterContainer } from "Components/Styled";

class SignOutController extends Component {
  constructor(props) {
    super(props);
    document.title = "Sign Out - UDIA";
    const { confirmSignOut, dispatch } = props;
    if (confirmSignOut) {
      dispatch(authActions.clearAuthData());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { confirmSignOut, dispatch } = nextProps;
    if (confirmSignOut) {
      dispatch(authActions.clearAuthData());
    }
  }

  handleSignOut = () => {
    this.props.dispatch(authActions.confirmSignOut());
  }

  render() {
    return (
      <CenterContainer>
        <h1>Sign Out</h1>
        <h4>Are you leaving?</h4>
        <Button onClick={this.handleSignOut}>Yes, farewell.</Button>
        <Link to="/">← No, I changed my mind.</Link>
      </CenterContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    confirmSignOut: state.auth.confirmSignOut
  };
}

const SignOut = connect(mapStateToProps)(SignOutController);

export { SignOut };
export default SignOut;
