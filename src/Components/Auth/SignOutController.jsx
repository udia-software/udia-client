// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { AuthActions } from '../../Modules/Auth';
import { Button, CenterContainer } from '../Styled';

type Props = {
  dispatch: Function,
  confirmSignOut: boolean,
};

class SignOutController extends Component<Props> {
  constructor(props) {
    super(props);
    document.title = 'Sign Out - UDIA';
    const { confirmSignOut, dispatch } = props;
    if (confirmSignOut) {
      dispatch(AuthActions.clearAuthData());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { confirmSignOut, dispatch } = nextProps;
    if (confirmSignOut) {
      dispatch(AuthActions.clearAuthData());
    }
  }

  handleSignOut = () => {
    this.props.dispatch(AuthActions.confirmSignOut());
  };

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
    confirmSignOut: state.auth.confirmSignOut,
  };
}

export default connect(mapStateToProps)(SignOutController);
