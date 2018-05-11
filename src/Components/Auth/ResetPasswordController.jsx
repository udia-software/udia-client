// @flow
import type { Dispatch } from 'redux';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';

import { AuthActions, AuthSelectors } from '../../Modules/Auth';
import ResetPasswordView from './ResetPasswordView';

type Props = {
  dispatch: Dispatch,
  match: any,
  client: ApolloClient,
  token: string,
};

type State = {
  loading: boolean,
  loadingText?: string,
  errors: string[],
  tokenErrors: string[],
  tokenVerifying: boolean,
  tokenVerified: boolean,
  tokenExpiry?: number,
};

const CHECK_RESET_TOKEN = gql`
  query CheckResetToken($token: String!) {
    checkResetToken(resetToken: $token) {
      isValid
      expiry
    }
  }
`;

class ResetPasswordController extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    document.title = 'Reset Password - UDIA';
    this.state = {
      loading: false,
      errors: [],
      tokenErrors: [],
      tokenVerifying: false,
      tokenVerified: false,
    };
  }

  componentDidMount = async () => {
    const urlVerificationToken = this.props.match.params.verificationToken || '';
    if (urlVerificationToken) {
      this.props.dispatch(AuthActions.setFormPasswordResetToken(urlVerificationToken));
      await this.handleCheckPasswordResetToken(undefined, urlVerificationToken);
    }
  };

  handleChangeVerificationToken = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.dispatch(AuthActions.setFormPasswordResetToken(event.target.value));
    this.setState({
      tokenErrors: [],
      tokenVerifying: false,
      tokenVerified: false,
      tokenExpiry: undefined,
    });
  };

  handleCheckPasswordResetToken = async (event?: SyntheticEvent<any>, rawToken?: string) => {
    if (event) {
      event.preventDefault();
    }
    const { client } = this.props;
    const { token } = this.props;
    this.setState({
      tokenErrors: [],
      tokenVerifying: true,
      tokenVerified: false,
      tokenExpiry: undefined,
    });

    try {
      const { data } = await client.query({
        query: CHECK_RESET_TOKEN,
        variables: { token: rawToken || token },
      });
      const { isValid, expiry } = data.checkResetToken;
      const tokenErrors = [];
      if (!isValid) {
        tokenErrors.push('Invalid token.');
      }
      this.setState({
        tokenVerified: true,
        tokenVerifying: false,
        tokenExpiry: expiry,
        tokenErrors,
      });
    } catch (error) {
      const {
        graphQLErrors, networkError, message, extraInfo,
      } = error;
      // eslint-disable-next-line no-console
      console.warn(message, graphQLErrors, networkError, extraInfo);
      const errors = [];
      if (networkError) {
        errors.push(message);
      }
      this.setState({
        errors,
        tokenVerified: false,
        tokenVerifying: false,
        tokenExpiry: undefined,
        tokenErrors: [],
      });
    }
  };

  handleSubmit = (event: SyntheticEvent<any>) => {
    event.preventDefault();
  };

  render = () => {
    const { token } = this.props;
    const {
      loading,
      loadingText,
      errors,
      tokenErrors,
      tokenVerifying,
      tokenVerified,
      tokenExpiry,
    } = this.state;
    console.log({
      loading,
      loadingText,
      token,
      errors,
      tokenVerifying,
      tokenVerified,
      tokenExpiry,
      tokenErrors,
    });
    return (
      <ResetPasswordView
        loading={loading}
        loadingText={loadingText}
        errors={errors}
        token={token}
        tokenVerifying={tokenVerifying}
        tokenVerified={tokenVerified}
        tokenErrors={tokenErrors}
        tokenExpiry={tokenExpiry}
        handleChangeVerificationToken={this.handleChangeVerificationToken}
        handleCheckPasswordResetToken={this.handleCheckPasswordResetToken}
        handleSubmit={this.handleSubmit}
      />
    );
  };
}

function mapStateToProps(state) {
  return { passwordResetToken: AuthSelectors.getPasswordResetToken(state) };
}

export default connect(mapStateToProps)(withApollo(ResetPasswordController));
