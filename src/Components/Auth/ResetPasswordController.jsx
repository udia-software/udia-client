// @flow
import type { Dispatch } from 'redux';
import { utc, duration } from 'moment';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';

import { AuthActions, AuthSelectors } from '../../Modules/Auth';
import Crypto from '../../Modules/Crypto';
import ResetPasswordView from './ResetPasswordView';

type Props = {
  dispatch: Dispatch,
  match: any,
  client: ApolloClient,
  passwordResetToken: string,
  password: string,
};

type State = {
  loading: boolean,
  loadingText?: string,
  errors: string[],
  tokenErrors: string[],
  tokenVerifying: boolean,
  tokenVerified: boolean,
  tokenExpiry?: number,
  humanizedDuration: string,
  diff: number,
  tickID?: IntervalID,
  passwordValidated: boolean,
  passwordErrors: string[],
  acknowledgedLoss: boolean,
  acknowledgedLossError: boolean,
};

const CHECK_RESET_TOKEN = gql`
  query CheckResetToken($token: String!) {
    checkResetToken(resetToken: $token) {
      isValid
      expiry
    }
  }
`;

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPasswordMutation(
    $resetToken: String!
    $newPw: String!
    $pwFunc: String!
    $pwDigest: String!
    $pwCost: Int!
    $pwKeySize: Int!
    $pwSalt: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      newPw: $newPw
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
      humanizedDuration: '',
      diff: -1,
      passwordValidated: false,
      passwordErrors: [],
      acknowledgedLoss: false,
      acknowledgedLossError: false,
    };
  }

  componentDidMount = async () => {
    const urlVerificationToken = this.props.match.params.verificationToken || '';
    if (urlVerificationToken) {
      this.props.dispatch(AuthActions.setFormPasswordResetToken(urlVerificationToken));
      await this.handleCheckPasswordResetToken(undefined, urlVerificationToken);
    }
  };

  componentWillUnmount() {
    clearInterval(this.state.tickID);
  }

  tickDuration(forceTokenExpiry?: number) {
    const { tokenExpiry } = this.state;
    let humanizedDuration = '';
    let diff: number = -1;
    if (tokenExpiry || forceTokenExpiry) {
      diff = utc(tokenExpiry || forceTokenExpiry).diff(utc());
      // humanizedDuration = duration(diff).humanize(true);
      const dInstance = duration(diff);
      const minutes = dInstance.get('minutes') > 0 ? `${dInstance.get('minutes')}:` : '';
      const seconds =
        dInstance.get('seconds') > 9
          ? `${dInstance.get('seconds')}`
          : `0${dInstance.get('seconds')}`;
      humanizedDuration = `${minutes}${seconds}`;
    }
    this.setState({ humanizedDuration, diff });
  }

  handleChangeVerificationToken = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.dispatch(AuthActions.setFormPasswordResetToken(event.target.value));
    this.setState({
      tokenErrors: [],
      tokenVerifying: false,
      tokenVerified: false,
      tokenExpiry: undefined,
      tickID: clearInterval(this.state.tickID),
      humanizedDuration: '',
      diff: -1,
    });
  };

  handleCheckPasswordResetToken = async (event?: SyntheticEvent<any>, rawToken?: string) => {
    if (event) {
      event.preventDefault();
    }
    const { client } = this.props;
    const { passwordResetToken } = this.props;
    this.setState({
      tokenErrors: [],
      tokenVerifying: true,
      tokenVerified: false,
      tokenExpiry: undefined,
      tickID: clearInterval(this.state.tickID),
    });

    try {
      const { data } = await client.query({
        query: CHECK_RESET_TOKEN,
        variables: { token: rawToken || passwordResetToken },
      });
      const { isValid, expiry } = data.checkResetToken;
      const tokenErrors = [];
      if (!isValid) {
        tokenErrors.push('Invalid token.');
      }
      this.tickDuration(expiry);
      this.setState({
        tokenVerified: isValid,
        tokenVerifying: false,
        tokenExpiry: expiry,
        tokenErrors,
        tickID: setInterval(this.tickDuration.bind(this), 1000),
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
      });
    }
  };

  handleChangePassword = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.dispatch(AuthActions.setFormPassword(event.target.value));
    this.setState({ passwordErrors: [], passwordValidated: false });
  };

  handleVerifyPassword = () => {
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

  handleAcknowledgedLoss = () => {
    this.setState({ acknowledgedLoss: !this.state.acknowledgedLoss });
  };

  handleSubmit = async (event: SyntheticEvent<any>) => {
    event.preventDefault();
    const validPassword = this.handleVerifyPassword();
    let { tokenErrors, passwordErrors } = this.state;
    if (!validPassword || tokenErrors.length > 0 || passwordErrors.length > 0) {
      return;
    }
    const { acknowledgedLoss } = this.state;
    if (!acknowledgedLoss) {
      this.setState({ acknowledgedLossError: true });
      return;
    }
    this.setState({ loading: true, loadingText: 'Deriving secure password...' });
    const { client, password, passwordResetToken } = this.props;
    try {
      const {
        pw, pwSalt, pwCost, pwKeySize, pwDigest, pwFunc,
      } = await Crypto.derivePassword({
        password,
      });
      this.setState({ loadingText: 'Communicating with server...' });
      const { data } = await client.mutate({
        mutation: RESET_PASSWORD_MUTATION,
        variables: {
          resetToken: passwordResetToken,
          newPw: pw,
          pwSalt,
          pwCost,
          pwKeySize,
          pwDigest,
          pwFunc,
        },
      });
      const { jwt, user } = data.resetPassword;
      this.setState({ loading: false });
      this.props.dispatch(AuthActions.setAuthData({ user, jwt }));
    } catch (error) {
      const {
        graphQLErrors, networkError, message, extraInfo,
      } = error;
      // eslint-disable-next-line no-console
      console.warn(message, graphQLErrors, networkError, extraInfo);

      const errors = [];
      tokenErrors = [];
      passwordErrors = [];
      graphQLErrors.forEach((graphQLError) => {
        const errorState = graphQLError.state || {};
        tokenErrors = tokenErrors.concat(errorState.resetToken || []);
        passwordErrors = passwordErrors.concat(errorState.password || []);
      });
      if (networkError) {
        errors.push(message);
      }
      this.setState({
        errors,
        tokenErrors,
        passwordErrors,
        loading: false,
      });
    }
  };

  render = () => {
    const { passwordResetToken, password } = this.props;
    const {
      loading,
      loadingText,
      errors,
      tokenErrors,
      tokenVerifying,
      tokenVerified,
      humanizedDuration,
      diff,
      passwordValidated,
      passwordErrors,
      acknowledgedLoss,
      acknowledgedLossError,
    } = this.state;

    return (
      <ResetPasswordView
        loading={loading}
        loadingText={loadingText}
        errors={errors}
        token={passwordResetToken}
        tokenVerifying={tokenVerifying}
        tokenVerified={tokenVerified}
        tokenErrors={tokenErrors}
        humanizedDuration={humanizedDuration}
        diff={diff}
        password={password}
        passwordValidated={passwordValidated}
        passwordErrors={passwordErrors}
        acknowledgedLoss={acknowledgedLoss}
        acknowledgedLossError={acknowledgedLossError}
        handleChangeVerificationToken={this.handleChangeVerificationToken}
        handleCheckPasswordResetToken={this.handleCheckPasswordResetToken}
        handleChangePassword={this.handleChangePassword}
        handleAcknowledgedLoss={this.handleAcknowledgedLoss}
        handleVerifyPassword={this.handleVerifyPassword}
        handleSubmit={this.handleSubmit}
      />
    );
  };
}

function mapStateToProps(state) {
  return {
    passwordResetToken: AuthSelectors.getPasswordResetToken(state),
    password: state.auth.password,
  };
}

export default connect(mapStateToProps)(withApollo(ResetPasswordController));
