// @flow
import type { Dispatch } from 'redux';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { AuthActions } from '../../Modules/Auth';
import ForgotPasswordView from './ForgotPasswordView';

type Props = {
  dispatch: Dispatch,
  email: string,
  sendForgotPasswordEmail: Function,
};

type State = {
  loading: boolean,
  loadingText?: string,
  errors: string[],
  emailErrors: string[],
  requestSent: boolean,
};

class ForgotPasswordController extends Component<Props, State> {
  constructor(props) {
    super(props);
    document.title = 'Forgot Password - UDIA';
    this.state = {
      loading: false,
      errors: [],
      emailErrors: [],
      requestSent: false,
    };
  }

  handleChangeEmail = (event) => {
    this.props.dispatch(AuthActions.setFormEmail(event.target.value));
    this.setState({ emailErrors: [] });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, sendForgotPasswordEmail } = this.props;
    this.setState({
      loading: true,
      errors: [],
      emailErrors: [],
      loadingText: 'Communicating with server...',
    });
    sendForgotPasswordEmail({ variables: { email } })
      .then(() => {
        this.setState({ loading: false, requestSent: true });
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
          loading: false,
          requestSent: false,
        });
      });
  };

  render = () => {
    const { email } = this.props;
    const {
      loading, loadingText, errors, emailErrors, requestSent,
    } = this.state;
    return (
      <ForgotPasswordView
        loading={loading}
        loadingText={loadingText}
        email={email}
        errors={errors}
        requestSent={requestSent}
        emailErrors={emailErrors}
        handleChangeEmail={this.handleChangeEmail}
        handleSubmit={this.handleSubmit}
      />
    );
  };
}

function mapStateToProps(state) {
  return {
    email: state.auth.email,
  };
}

const SEND_FORGOT_PASSWORD_EMAIL = gql`
  mutation SendForgotPasswordEmail($email: String!) {
    sendForgotPasswordEmail(email: $email)
  }
`;

export default connect(mapStateToProps)(graphql(SEND_FORGOT_PASSWORD_EMAIL, {
  name: 'sendForgotPasswordEmail',
})(ForgotPasswordController));
