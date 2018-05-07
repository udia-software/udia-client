// @flow
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import Crypto from '../../Modules/Crypto';

import { AuthActions } from '../../Modules/Auth';
import SignInView from './SignInView';

type Props = {
  dispatch: Dispatch,
  client: ApolloClient,
  email: string,
  password: string,
};

type State = {
  loading: boolean,
  loadingText?: string,
  errors: string[],
  emailErrors: string[],
  passwordErrors: string[],
};

const SIGN_IN_MUTATION = gql`
  mutation signInMutation($email: String!, $pw: String!) {
    signInUser(email: $email, pw: $pw) {
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

const GET_AUTH_PARAMS_QUERY = gql`
  query getAuthParamsQuery($email: String!) {
    getUserAuthParams(email: $email) {
      pwFunc
      pwDigest
      pwCost
      pwKeySize
      pwSalt
    }
  }
`;

class SignInController extends Component<Props, State> {
  constructor(props) {
    super(props);
    document.title = 'Sign In - UDIA';
    this.state = {
      errors: [],
      emailErrors: [],
      passwordErrors: [],
      loading: false,
    };
  }

  handleChangeEmail = (event) => {
    this.props.dispatch(AuthActions.setFormEmail(event.target.value));
    this.setState({ emailErrors: [] });
  };

  handleChangePassword = (event) => {
    this.props.dispatch(AuthActions.setFormPassword(event.target.value));
    this.setState({ passwordErrors: [] });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      client, dispatch, email, password,
    } = this.props;
    this.setState({
      loading: true,
      loadingText: 'Fetching auth params...',
      emailErrors: [],
      passwordErrors: [],
    });
    client
      .query({ query: GET_AUTH_PARAMS_QUERY, variables: { email } })
      .then(({ data }) => {
        this.setState({ loadingText: 'Deriving secure password...' });
        const {
          pwFunc, pwDigest, pwCost, pwKeySize, pwSalt,
        } = data.getUserAuthParams;
        return Crypto.derivePassword({
          password,
          pwFunc,
          pwDigest,
          pwCost,
          pwKeySize,
          pwSalt,
        });
      })
      .then(({ pw }) => {
        this.setState({ loadingText: 'Communicating with server...' });
        return client.mutate({ mutation: SIGN_IN_MUTATION, variables: { email, pw } });
      })
      .then(({ data }) => {
        this.setState({ loadingText: 'Setting up client...' });
        const { jwt, user } = data.signInUser;
        dispatch(AuthActions.setAuthData({ jwt, user }));
      })
      .catch(({
        graphQLErrors, networkError, message, extraInfo,
      }) => {
        console.warn(message, graphQLErrors, networkError, extraInfo);
        const errors = [];
        let emailErrors = [];
        let passwordErrors = [];
        graphQLErrors.forEach((graphQLError) => {
          const errorState = graphQLError.state || {};
          emailErrors = emailErrors.concat(errorState.email || []);
          passwordErrors = passwordErrors.concat(errorState.pw || []);
        });
        if (networkError) {
          errors.push(message);
        }
        this.setState({
          errors,
          emailErrors,
          passwordErrors,
          loading: false,
        });
      });
  };

  render = () => {
    const {
      loading, loadingText, errors, passwordErrors, emailErrors,
    } = this.state;
    const { email, password } = this.props;
    return (
      <SignInView
        loading={loading}
        loadingText={loadingText}
        email={email}
        password={password}
        errors={errors}
        emailErrors={emailErrors}
        passwordErrors={passwordErrors}
        handleChangeEmail={this.handleChangeEmail}
        handleChangePassword={this.handleChangePassword}
        handleSubmit={this.handleSubmit}
      />
    );
  };
}

function mapStateToProps(state) {
  return {
    email: state.auth.email,
    password: state.auth.password,
  };
}

export default connect(mapStateToProps)(withApollo(SignInController));
