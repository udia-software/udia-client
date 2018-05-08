// @flow
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { AuthActions } from '../../Modules/Auth';
import SignUpView from './SignUpView';
import Crypto from '../../Modules/Crypto';

type Props = {
  dispatch: Dispatch,
  signUpUserMutation: Function,
  email: string,
  username: string,
  password: string,
};

type State = {
  loading: boolean,
  loadingText?: string,
  errors: string[],
  emailErrors: string[],
  usernameErrors: string[],
  passwordErrors: string[],
};

class SignUpController extends Component<Props, State> {
  constructor(props) {
    super(props);
    document.title = 'Sign Up - UDIA';
    this.state = {
      loading: false,
      errors: [],
      emailErrors: [],
      usernameErrors: [],
      passwordErrors: [],
    };
  }

  handleChangeEmail = (event) => {
    this.props.dispatch(AuthActions.setFormEmail(event.target.value));
    this.setState({ emailErrors: [] });
  };

  handleChangeUsername = (event) => {
    this.props.dispatch(AuthActions.setFormUsername(event.target.value));
    this.setState({ usernameErrors: [] });
  };

  handleChangePassword = (event) => {
    this.props.dispatch(AuthActions.setFormPassword(event.target.value));
    this.setState({ passwordErrors: [] });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      signUpUserMutation, dispatch, email, username, password,
    } = this.props;
    this.setState({
      loading: true,
      loadingText: 'Deriving secure password...',
      emailErrors: [],
      usernameErrors: [],
      passwordErrors: [],
    });
    Crypto.derivePassword({ password })
      .then((result) => {
        this.setState({ loadingText: 'Communicating with server...' });
        const {
          pw, pwSalt, pwCost, pwKeySize, pwDigest, pwFunc,
        } = result;
        return signUpUserMutation({
          variables: {
            email,
            username,
            pw,
            pwSalt,
            pwCost,
            pwKeySize,
            pwDigest,
            pwFunc,
          },
        });
      })
      .then(({ data }) => {
        this.setState({ loadingText: 'Setting up client...' });
        const { jwt, user } = data.createUser;
        dispatch(AuthActions.setAuthData({ jwt, user }));
      })
      .catch(({
        graphQLErrors, networkError, message, extraInfo,
      }) => {
        console.warn(message, graphQLErrors, networkError, extraInfo); // eslint-disable-line no-console
        const errors = [];
        let emailErrors = [];
        let usernameErrors = [];
        let passwordErrors = [];
        graphQLErrors.forEach((graphQLError) => {
          const errorState = graphQLError.state || {};
          emailErrors = emailErrors.concat(errorState.email || []);
          usernameErrors = usernameErrors.concat(errorState.username || []);
          passwordErrors = passwordErrors.concat(errorState.password || []);
        });
        if (networkError) {
          errors.push(message);
        }
        this.setState({
          errors,
          emailErrors,
          usernameErrors,
          passwordErrors,
          loading: false,
        });
      });
  };

  render() {
    const { email, username, password } = this.props;
    const {
      loading,
      loadingText,
      errors,
      emailErrors,
      usernameErrors,
      passwordErrors,
    } = this.state;
    return (
      <SignUpView
        loading={loading}
        loadingText={loadingText}
        email={email}
        username={username}
        password={password}
        errors={errors}
        emailErrors={emailErrors}
        usernameErrors={usernameErrors}
        passwordErrors={passwordErrors}
        handleChangeEmail={this.handleChangeEmail}
        handleChangeUsername={this.handleChangeUsername}
        handleChangePassword={this.handleChangePassword}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    email: state.auth.email,
    username: state.auth.username,
    password: state.auth.password,
  };
}

const SIGN_UP_MUTATION = gql`
  mutation CreateUserMutation(
    $email: String!
    $username: String!
    $pw: String!
    $pwFunc: String!
    $pwDigest: String!
    $pwCost: Int!
    $pwKeySize: Int!
    $pwSalt: String!
  ) {
    createUser(
      email: $email
      username: $username
      pw: $pw
      pwFunc: $pwFunc
      pwDigest: $pwDigest
      pwCost: $pwCost
      pwKeySize: $pwKeySize
      pwSalt: $pwSalt
    ) {
      jwt
      user {
        uuid
        username
        emails {
          email
          primary
          verified
          createdAt
          updatedAt
          verificationExpiry
        }
        pwFunc
        pwDigest
        pwCost
        pwKeySize
        pwSalt
        createdAt
        updatedAt
      }
    }
  }
`;

export default connect(mapStateToProps)(graphql(SIGN_UP_MUTATION, { name: 'signUpUserMutation' })(SignUpController));
