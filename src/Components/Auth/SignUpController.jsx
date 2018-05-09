// @flow
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { AuthActions } from '../../Modules/Auth';
import SignUpView from './SignUpView';
import Crypto from '../../Modules/Crypto';

type Props = {
  dispatch: Dispatch,
  client: ApolloClient,
  email: string,
  username: string,
  password: string,
};

type State = {
  loading: boolean,
  loadingText?: string,
  emailValidated: boolean,
  usernameValidated: boolean,
  passwordValidated: boolean,
  errors: string[],
  emailErrors: string[],
  usernameErrors: string[],
  passwordErrors: string[],
};

const CHECK_EMAIL_EXISTS = gql`
  query CheckEmailExists($email: String!) {
    checkEmailExists(email: $email)
  }
`;

const CHECK_USERNAME_EXISTS = gql`
  query CheckUsernameExists($username: String!) {
    checkUsernameExists(username: $username)
  }
`;

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

class SignUpController extends Component<Props, State> {
  constructor(props) {
    super(props);
    document.title = 'Sign Up - UDIA';
    this.state = {
      loading: false,
      emailValidated: false,
      usernameValidated: false,
      passwordValidated: false,
      errors: [],
      emailErrors: [],
      usernameErrors: [],
      passwordErrors: [],
    };
  }

  handleChangeEmail = (event) => {
    this.props.dispatch(AuthActions.setFormEmail(event.target.value));
    this.setState({ emailErrors: [], emailValidated: false });
  };

  handleEmailBlur = () => {
    const { client, email } = this.props;
    this.setState({ emailValidated: false });
    client
      .query({
        query: CHECK_EMAIL_EXISTS,
        variables: { email },
      })
      .then(() => {
        this.setState({ emailValidated: true });
      })
      .catch(({
        graphQLErrors, networkError, message, extraInfo,
      }) => {
        // eslint-disable-next-line no-console
        console.warn(message, graphQLErrors, networkError, extraInfo);
        const errors = [];
        let emailErrors = [];
        graphQLErrors.forEach((graphQLError) => {
          const errorState = graphQLError.state || {};
          emailErrors = emailErrors.concat(errorState.email || []);
        });
        if (networkError) {
          errors.push(message);
        }
        this.setState({
          errors,
          emailErrors,
          emailValidated: false,
        });
      });
  };

  handleChangeUsername = (event) => {
    this.props.dispatch(AuthActions.setFormUsername(event.target.value));
    this.setState({ usernameErrors: [], usernameValidated: false });
  };

  handleUsernameBlur = () => {
    const { client, username } = this.props;
    this.setState({ usernameValidated: false });
    client
      .query({
        query: CHECK_USERNAME_EXISTS,
        variables: { username },
      })
      .then(() => {
        this.setState({ usernameValidated: true });
      })
      .catch(({
        graphQLErrors, networkError, message, extraInfo,
      }) => {
        // eslint-disable-next-line no-console
        console.warn(message, graphQLErrors, networkError, extraInfo);
        const errors = [];
        let usernameErrors = [];
        graphQLErrors.forEach((graphQLError) => {
          const errorState = graphQLError.state || {};
          usernameErrors = usernameErrors.concat(errorState.username || []);
        });
        if (networkError) {
          errors.push(message);
        }
        this.setState({
          errors,
          usernameErrors,
          usernameValidated: false,
        });
      });
  };

  handleChangePassword = (event) => {
    this.props.dispatch(AuthActions.setFormPassword(event.target.value));
    this.setState({ passwordErrors: [], passwordValidated: false });
  };

  handlePasswordBlur = () => {
    const { password } = this.props;
    // password validation is done client side.
    if (password.length < 8) {
      this.setState({
        passwordErrors: ['Master password must be 8 or more characters.'],
        passwordValidated: false,
      });
    } else {
      this.setState({
        passwordValidated: true,
      });
      return true;
    }
    return false;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const validPassword = this.handlePasswordBlur();
    if (!validPassword) {
      return;
    }
    const {
      client, dispatch, email, username, password,
    } = this.props;
    this.setState({
      loading: true,
      loadingText: 'Deriving secure password...',
      errors: [],
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
        return client.mutate({
          mutation: SIGN_UP_MUTATION,
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
        // eslint-disable-next-line no-console
        console.warn(message, graphQLErrors, networkError, extraInfo);
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
      emailValidated,
      usernameValidated,
      passwordValidated,
      errors,
      emailErrors,
      usernameErrors,
      passwordErrors,
    } = this.state;
    return (
      <SignUpView
        loading={loading}
        loadingText={loadingText}
        emailValidated={emailValidated}
        usernameValidated={usernameValidated}
        passwordValidated={passwordValidated}
        email={email}
        username={username}
        password={password}
        errors={errors}
        emailErrors={emailErrors}
        usernameErrors={usernameErrors}
        passwordErrors={passwordErrors}
        handleChangeEmail={this.handleChangeEmail}
        handleEmailBlur={this.handleEmailBlur}
        handleChangeUsername={this.handleChangeUsername}
        handleUsernameBlur={this.handleUsernameBlur}
        handleChangePassword={this.handleChangePassword}
        handlePasswordBlur={this.handlePasswordBlur}
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

export default connect(mapStateToProps)(withApollo(SignUpController));
