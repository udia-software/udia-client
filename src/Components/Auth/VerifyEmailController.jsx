// @flow
import type { Dispatch } from 'redux';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { AuthActions, AuthSelectors } from '../../Modules/Auth';
import VerifyEmailView from './VerifyEmailView';

type Props = {
  dispatch: Dispatch,
  match: any,
  verifyEmailTokenMutation: Function,
  token: string,
};

type State = {
  loading: boolean,
  loadingText?: string,
  errors: string[],
  tokenErrors: string[],
  tokenVerified: boolean,
};

class VerifyEmailController extends Component<Props, State> {
  constructor(props) {
    super(props);
    document.title = 'Verify Email - UDIA';
    this.state = {
      loading: false,
      errors: [],
      tokenErrors: [],
      tokenVerified: false,
    };
  }

  componentDidMount() {
    const urlVerificationToken = this.props.match.params.verificationToken || '';
    if (urlVerificationToken) {
      this.props.dispatch(AuthActions.setFormEmailVerificationToken(urlVerificationToken));
      this.handleSubmit({ preventDefault: () => {} }, urlVerificationToken);
    }
  }

  handleChangeVerificationToken = (event) => {
    this.props.dispatch(AuthActions.setFormEmailVerificationToken(event.target.value));
    this.setState({ tokenErrors: [] });
  };

  handleSubmit = (event, rawToken?: string) => {
    event.preventDefault();
    const { verifyEmailTokenMutation } = this.props;
    let { token } = this.props;
    if (rawToken) {
      token = rawToken;
    }
    this.setState({
      loading: true,
      loadingText: 'Communicating with server...',
      errors: [],
      tokenErrors: [],
    });
    verifyEmailTokenMutation({ variables: { token } })
      .then(() => {
        this.setState({ loading: false, tokenVerified: true });
      })
      .catch(({
        graphQLErrors, networkError, message, extraInfo,
      }) => {
        // eslint-disable-next-line no-console
        console.warn(message, graphQLErrors, networkError, extraInfo);
        const errors = [];
        let tokenErrors = [];
        graphQLErrors.forEach((graphQLError) => {
          const errorState = graphQLError.state || {};
          tokenErrors = tokenErrors.concat(errorState.emailToken || []);
        });
        if (networkError) {
          errors.push(message);
        }
        this.setState({
          errors,
          tokenErrors,
          loading: false,
          tokenVerified: false,
        });
      });
  };

  render = () => {
    const { token } = this.props;
    const {
      loading, loadingText, errors, tokenErrors, tokenVerified,
    } = this.state;
    return (
      <VerifyEmailView
        loading={loading}
        loadingText={loadingText}
        errors={errors}
        tokenErrors={tokenErrors}
        token={token}
        tokenVerified={tokenVerified}
        handleChangeVerificationToken={this.handleChangeVerificationToken}
        handleSubmit={this.handleSubmit}
      />
    );
  };
}

function mapStateToProps(state) {
  return { token: AuthSelectors.getEmailVerificationToken(state) };
}

const VERIFY_EMAIL_TOKEN_MUTATION = gql`
  mutation VerifyEmailToken($token: String!) {
    verifyEmailToken(emailToken: $token)
  }
`;

export default connect(mapStateToProps)(graphql(VERIFY_EMAIL_TOKEN_MUTATION, {
  name: 'verifyEmailTokenMutation',
})(VerifyEmailController));
