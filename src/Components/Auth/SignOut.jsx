import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

import { authActions } from "Modules/Auth";
import { Button } from "Components/Styled";

const SignOutContainer = styled.div`
  display: grid;
  grid-auto-rows: auto;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: center;

  grid-area: content;
  justify-self: center;
  align-self: center;
  margin: 1em;
`;

class SignOutController extends Component {
  constructor(props) {
    super(props);
    document.title = "Sign Out - UDIA";
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
      <SignOutContainer>
        <h1>Sign Out</h1>
        <h4>Are you leaving?</h4>
        <Button onClick={this.handleSignOut}>Yes, farewell.</Button>
        <Link to="/">← No, I changed my mind.</Link>
      </SignOutContainer>
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
