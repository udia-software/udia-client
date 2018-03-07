import gql from "graphql-tag";
import React, { Component } from "react";
import { graphql } from "react-apollo";
import { connect } from "react-redux";

import { authActions } from "Modules/Auth";
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
    const { signInUserMutation } = this.props;
    this.setState({ loading: true, emailErrors: [], passwordErrors: [] });
    signInUserMutation({
      variables: {
        email: "",
        password: ""
      }
    })
      .then(data => {
        console.log(data);
      })
      .catch(({ graphQLErrors, networkError, message, extraInfo }) => {
        console.error(message, graphQLErrors, networkError, extraInfo);
        let errors = [];
        let emailErrors = [];
        let passwordErrors = [];
        graphQLErrors.forEach(graphQLError => {
          const errorState = graphQLError.state || {};
          emailErrors = emailErrors.concat(errorState.email || []);
          passwordErrors = passwordErrors.concat(errorState.password || []);
        });
        if (networkError) {
          errors.push(message);
        }
        this.setState({ errors, emailErrors, passwordErrors });
      })
      .finally(() => {
        this.setState({ loading: false });
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
      }
    }
  }
`;

export const SignIn = connect(mapStateToProps)(
  graphql(SIGN_IN_MUTATION, { name: "signInUserMutation" })(SignInController)
);
