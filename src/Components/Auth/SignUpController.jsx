import gql from "graphql-tag";
import React, { Component } from "react";
import { graphql } from "react-apollo";
import { connect } from "react-redux";

import { authActions } from "../../Modules/Auth";
import SignUpView from "./SignUpView";

class SignUpController extends Component {
  constructor(props) {
    super(props);
    document.title = "Sign Up - UDIA";
    this.state = {
      loading: false,
      errors: [],
      emailErrors: [],
      usernameErrors: [],
      passwordErrors: []
    };
  }

  handleChangeEmail = event => {
    this.props.dispatch(authActions.setFormEmail(event.target.value));
    this.setState({ emailErrors: [] });
  };

  handleChangeUsername = event => {
    this.props.dispatch(authActions.setFormUsername(event.target.value));
    this.setState({ usernameErrors: [] });
  };

  handleChangePassword = event => {
    this.props.dispatch(authActions.setFormPassword(event.target.value));
    this.setState({ passwordErrors: [] });
  };

  handleSubmit = event => {
    event.preventDefault();
    const {
      signUpUserMutation,
      dispatch,
      email,
      username,
      password
    } = this.props;
    this.setState({
      loading: true,
      emailErrors: [],
      usernameErrors: [],
      passwordErrors: []
    });
    signUpUserMutation({ variables: { email, username, password } })
      .then(({ data }) => {
        const { token, user } = data.createUser;
        dispatch(authActions.setAuthData({ jwt: token, user }));
      })
      .catch(({ graphQLErrors, networkError, message, extraInfo }) => {
        console.warn(message, graphQLErrors, networkError, extraInfo);
        const errors = [];
        let emailErrors = [];
        let usernameErrors = [];
        let passwordErrors = [];
        graphQLErrors.forEach(graphQLError => {
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
          loading: false
        });
      });
  };

  render() {
    const { email, username, password } = this.props;
    const {
      loading,
      errors,
      emailErrors,
      usernameErrors,
      passwordErrors
    } = this.state;
    return (
      <SignUpView
        loading={loading}
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
    password: state.auth.password
  };
}

const SIGN_UP_MUTATION = gql`
  mutation CreateUserMutation(
    $email: String!
    $password: String!
    $username: String!
  ) {
    createUser(email: $email, username: $username, password: $password) {
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

const SignUp = connect(mapStateToProps)(
  graphql(SIGN_UP_MUTATION, { name: "signUpUserMutation" })(SignUpController)
);

export { SignUp };
export default SignUp;
