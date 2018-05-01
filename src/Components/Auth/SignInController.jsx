import gql from "graphql-tag";
import React, { Component } from "react";
import { graphql } from "react-apollo";
import { connect } from "react-redux";

import { authActions } from "../../Modules/Auth";
import SignInView from "./SignInView";

class SignInController extends Component {
  constructor(props) {
    super(props);
    document.title = "Sign In - UDIA";
    this.state = {
      errors: [],
      emailErrors: [],
      passwordErrors: [],
      loading: false
    };
  }

  handleChangeEmail = event => {
    this.props.dispatch(authActions.setFormEmail(event.target.value));
    this.setState({ emailErrors: [] });
  };

  handleChangePassword = event => {
    this.props.dispatch(authActions.setFormPassword(event.target.value));
    this.setState({ passwordErrors: [] });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { signInUserMutation, dispatch, email, password } = this.props;
    this.setState({ loading: true, emailErrors: [], passwordErrors: [] });
    signInUserMutation({ variables: { email, password } })
      .then(({ data }) => {
        const { token, user } = data.signinUser;
        dispatch(authActions.setAuthData({ jwt: token, user }));
      })
      .catch(({ graphQLErrors, networkError, message, extraInfo }) => {
        console.warn(message, graphQLErrors, networkError, extraInfo);
        const errors = [];
        let emailErrors = [];
        let passwordErrors = [];
        graphQLErrors.forEach(graphQLError => {
          const errorState = graphQLError.state || {};
          emailErrors = emailErrors.concat(errorState.email || []);
          passwordErrors = passwordErrors.concat(errorState.rawPassword || []);
        });
        if (networkError) {
          errors.push(message);
        }
        this.setState({ errors, emailErrors, passwordErrors, loading: false });
      });
  };

  render = () => {
    const { loading, errors, passwordErrors, emailErrors } = this.state;
    const { email, password } = this.props;
    return (
      <SignInView
        loading={loading}
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
    password: state.auth.password
  };
}

const SIGN_IN_MUTATION = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }) {
      token
      user {
        _id
        username
        createdAt
        updatedAt
        email
        emailVerified
      }
    }
  }
`;

const SignIn = connect(mapStateToProps)(
  graphql(SIGN_IN_MUTATION, { name: "signInUserMutation" })(SignInController)
);
export { SignIn };
export default SignIn;
