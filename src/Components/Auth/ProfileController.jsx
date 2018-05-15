// @flow
import type { Dispatch } from 'redux';
import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { utc } from 'moment';
import gql from 'graphql-tag';

import ProfileControllerView from './ProfileControllerView';
import { AuthActions, AuthSelectors } from '../../Modules/Auth';
import Crypto from '../../Modules/Crypto';
import TimeHelper from '../../Modules/TimeHelper';

type Props = {
  client: ApolloClient,
  dispatch: Dispatch,
  username: string,
  createdAt: Date,
  updatedAt: Date,
  emails: any[],
  password: string,
};

type State = {
  loading: boolean,
  loadingText?: string,
  tickIntervalID: IntervalID,
  exactHumanCreatedAgo: string,
  exactHumanUpdatedAgo: string,
  errors: string[],
  addEmailInput: string,
  addEmailErrors: string[],
  emailValidated: boolean,
  changeEmailSuccesses: string[],
  oldPasswordErrors: string[],
  newPassword: string,
  newPasswordErrors: string[],
  newPasswordValidated: boolean,
  updatePasswordSuccesses: string[],
};

const ADD_EMAIL_MUTATION = gql`
  mutation AddEmailMutation($email: String!) {
    addEmail(email: $email) {
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
`;

const SET_PRIMARY_EMAIL_MUTATION = gql`
  mutation SetPrimaryEmailMutation($email: String!) {
    setPrimaryEmail(email: $email) {
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
`;

const REMOVE_EMAIL_MUTATION = gql`
  mutation RemoveEmailMutation($email: String!) {
    removeEmail(email: $email) {
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
`;

const SEND_VERIFICATION_EMAIL_MUTATION = gql`
  mutation SendEmailVerificationMutation($email: String!) {
    sendEmailVerification(email: $email)
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

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePasswordMutation(
    $newPw: String!
    $pw: String!
    $pwFunc: String!
    $pwDigest: String!
    $pwCost: Int!
    $pwKeySize: Int!
    $pwSalt: String!
  ) {
    updatePassword(
      newPw: $newPw
      pw: $pw
      pwFunc: $pwFunc
      pwDigest: $pwDigest
      pwCost: $pwCost
      pwKeySize: $pwKeySize
      pwSalt: $pwSalt
    ) {
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
`;

const CHECK_EMAIL_EXISTS = gql`
  query CheckEmailExists($email: String!) {
    checkEmailExists(email: $email)
  }
`;

/**
 * this could be refactored
 */
class ProfileController extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    document.title = 'My Profile - UDIA';
    const { createdAt, updatedAt } = this.props;
    this.state = {
      exactHumanCreatedAgo: TimeHelper.exactHumanizedTimeFrom(utc(createdAt)),
      exactHumanUpdatedAgo: TimeHelper.exactHumanizedTimeFrom(utc(updatedAt)),
      tickIntervalID: setInterval(this.tickProfileTimes.bind(this), 1000),
      errors: [],
      addEmailInput: '',
      addEmailErrors: [],
      emailValidated: false,
      loading: false,
      changeEmailSuccesses: [],
      oldPasswordErrors: [],
      newPassword: '',
      newPasswordErrors: [],
      newPasswordValidated: false,
      updatePasswordSuccesses: [],
    };
  }

  componentDidMount() {
    this.tickProfileTimes();
  }

  componentWillUnmount() {
    clearInterval(this.state.tickIntervalID);
  }

  handleChangeAddEmail = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      addEmailInput: event.target.value,
      emailValidated: false,
      loading: false,
      addEmailErrors: [],
      errors: [],
    });
  };

  handleEmailBlur = async () => {
    const { client } = this.props;
    const { addEmailInput } = this.state;
    this.setState({ emailValidated: false, loading: false });
    try {
      await client.query({
        query: CHECK_EMAIL_EXISTS,
        variables: { email: addEmailInput },
      });
      this.setState({ emailValidated: true, loading: false });
    } catch (error) {
      const {
        graphQLErrors, networkError, message, extraInfo,
      } = error;
      // eslint-disable-next-line no-console
      console.warn(message, graphQLErrors, networkError, extraInfo);
      const errors = [];
      let addEmailErrors = [];
      graphQLErrors.forEach((graphQLError) => {
        const errorState = graphQLError.state || {};
        addEmailErrors = addEmailErrors.concat(errorState.email || []);
      });
      if (networkError) {
        errors.push(message);
      }
      this.setState({
        errors,
        addEmailErrors,
        emailValidated: false,
        loading: false,
      });
    }
  };

  handleAddEmailSubmit = async (event: SyntheticEvent<any>) => {
    event.preventDefault();
    const { client, dispatch } = this.props;
    const { addEmailInput } = this.state;
    this.setState({
      emailValidated: false,
      loading: true,
      errors: [],
      addEmailErrors: [],
    });
    try {
      const { data } = await client.mutate({
        mutation: ADD_EMAIL_MUTATION,
        variables: {
          email: addEmailInput,
        },
      });
      dispatch(AuthActions.setAuthUser(data.addEmail));
      this.setState({
        addEmailInput: '',
        addEmailErrors: [],
        emailValidated: true,
        loading: false,
        changeEmailSuccesses: [`Successfully added ${addEmailInput}.`],
      });
    } catch (error) {
      const {
        graphQLErrors, networkError, message, extraInfo,
      } = error;
      // eslint-disable-next-line no-console
      console.warn(message, graphQLErrors, networkError, extraInfo);
      let addEmailErrors = [];
      graphQLErrors.forEach((graphQLError) => {
        const errorState = graphQLError.state || {};
        addEmailErrors = addEmailErrors.concat(errorState.email || []);
      });
      if (networkError) {
        addEmailErrors.push(message);
      }
      this.setState({
        addEmailErrors,
        emailValidated: false,
        loading: false,
      });
    }
  };

  handleResendVerification = (email: string) => async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { client } = this.props;
    this.setState({
      errors: [],
      addEmailErrors: [],
      loading: true,
      changeEmailSuccesses: [],
    });
    try {
      await client.mutate({
        mutation: SEND_VERIFICATION_EMAIL_MUTATION,
        variables: { email },
      });
      this.setState({
        loading: false,
        changeEmailSuccesses: [`Successfully resent verification to ${email}.`],
      });
    } catch (error) {
      const {
        graphQLErrors, networkError, message, extraInfo,
      } = error;
      // eslint-disable-next-line no-console
      console.warn(message, graphQLErrors, networkError, extraInfo);
      let errors = [];
      graphQLErrors.forEach((graphQLError) => {
        const errorState = graphQLError.state || {};
        errors = errors.concat(errorState.email || []);
      });
      if (networkError) {
        errors.push(message);
      }
      this.setState({
        errors,
        loading: false,
        changeEmailSuccesses: [],
      });
    }
  };

  handleSetAsPrimary = (email: string) => async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { client, dispatch } = this.props;
    this.setState({
      errors: [],
      addEmailErrors: [],
      loading: true,
      changeEmailSuccesses: [],
    });
    try {
      const { data } = await client.mutate({
        mutation: SET_PRIMARY_EMAIL_MUTATION,
        variables: { email },
      });
      dispatch(AuthActions.setAuthUser(data.setPrimaryEmail));
      this.setState({
        loading: false,
        changeEmailSuccesses: [`Successfully set ${email} to be primary.`],
      });
    } catch (error) {
      const {
        graphQLErrors, networkError, message, extraInfo,
      } = error;
      // eslint-disable-next-line no-console
      console.warn(message, graphQLErrors, networkError, extraInfo);
      let errors = [];
      graphQLErrors.forEach((graphQLError) => {
        const errorState = graphQLError.state || {};
        errors = errors.concat(errorState.email || []);
      });
      if (networkError) {
        errors.push(message);
      }
      this.setState({
        errors,
        loading: false,
        changeEmailSuccesses: [],
      });
    }
  };

  handleDeleteEmail = (email: string) => async (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { client, dispatch } = this.props;
    this.setState({
      errors: [],
      addEmailErrors: [],
      loading: true,
      changeEmailSuccesses: [],
    });
    try {
      const { data } = await client.mutate({
        mutation: REMOVE_EMAIL_MUTATION,
        variables: { email },
      });
      dispatch(AuthActions.setAuthUser(data.removeEmail));
      this.setState({
        loading: false,
        changeEmailSuccesses: [`Successfully deleted ${email}.`],
      });
    } catch (error) {
      const {
        graphQLErrors, networkError, message, extraInfo,
      } = error;
      // eslint-disable-next-line no-console
      console.warn(message, graphQLErrors, networkError, extraInfo);
      let errors = [];
      graphQLErrors.forEach((graphQLError) => {
        const errorState = graphQLError.state || {};
        errors = errors.concat(errorState.email || []);
      });
      if (networkError) {
        errors.push(message);
      }
      this.setState({
        errors,
        loading: false,
        changeEmailSuccesses: [],
      });
    }
  };

  handleNewPasswordSubmit = (event: SyntheticEvent<any>) => {
    event.preventDefault();
    const { client, emails, password } = this.props;

    const { newPassword } = this.state;
    const newPasswordErrors = Crypto.validateUserInputtedPassword(newPassword);
    if (newPasswordErrors.length > 0) {
      this.setState({ newPasswordErrors });
      return;
    }

    this.setState({
      loading: true,
      loadingText: 'Fetching auth params...',
      updatePasswordSuccesses: [],
      newPasswordErrors: [],
      oldPasswordErrors: [],
    });
    const uEmail = emails.reduce((acc, curr) => (curr.primary ? curr : acc));
    let oldPassword: string = '';
    client
      .query({ query: GET_AUTH_PARAMS_QUERY, variables: { email: uEmail.email } })
      .then(({ data }) => {
        this.setState({ loadingText: 'Deriving old secure password...' });
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
        oldPassword = pw;
        this.setState({ loadingText: 'Deriving new secure password...' });
        return Crypto.derivePassword({
          password: newPassword,
        });
      })
      .then(({
        pw, pwFunc, pwDigest, pwCost, pwKeySize, pwSalt,
      }) => {
        this.setState({ loadingText: 'Communicating with server...' });
        return client.mutate({
          mutation: UPDATE_PASSWORD_MUTATION,
          variables: {
            newPw: pw,
            pw: oldPassword,
            pwFunc,
            pwDigest,
            pwCost,
            pwKeySize,
            pwSalt,
          },
        });
      })
      .then(() => {
        this.setState({
          loading: false,
          updatePasswordSuccesses: ['Successfully updated password.'],
        });
      })
      .catch(({
        graphQLErrors, networkError, message, extraInfo,
      }) => {
        // eslint-disable-next-line no-console
        console.warn(message, graphQLErrors, networkError, extraInfo);
        let oldPasswordErrors = [];
        graphQLErrors.forEach((graphQLError) => {
          const errorState = graphQLError.state || {};
          oldPasswordErrors = oldPasswordErrors.concat(errorState.pw || []);
        });
        if (networkError) {
          oldPasswordErrors.push(message);
        }
        this.setState({
          oldPasswordErrors,
          loading: false,
          updatePasswordSuccesses: [],
        });
      });
  };

  handleNewPasswordBlur = () => {
    const { newPassword } = this.state;
    const newPasswordErrors = Crypto.validateUserInputtedPassword(newPassword);
    this.setState({ newPasswordErrors });
  };

  handleChangeOldPassword = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.props.dispatch(AuthActions.setFormPassword(event.target.value));
  };

  handleChangeNewPassword = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ newPassword: event.target.value });
  };

  tickProfileTimes() {
    const { createdAt, updatedAt } = this.props;
    const stateDiff = {
      exactHumanCreatedAgo: TimeHelper.exactHumanizedTimeFrom(utc(createdAt)),
      exactHumanUpdatedAgo: TimeHelper.exactHumanizedTimeFrom(utc(updatedAt)),
    };
    this.setState(stateDiff);
  }

  render() {
    const {
      username, createdAt, updatedAt, emails, password,
    } = this.props;
    const sortedEmails = [...emails].sort((a, b) => {
      if (!a.primary && b.primary) {
        return 1;
      }
      if (a.primary && !b.primary) {
        return -1;
      }
      return 0; // a equal to b
    });
    const {
      exactHumanCreatedAgo,
      exactHumanUpdatedAgo,
      errors,
      addEmailInput,
      addEmailErrors,
      emailValidated,
      loading,
      loadingText,
      changeEmailSuccesses,
      oldPasswordErrors,
      newPassword,
      newPasswordErrors,
      newPasswordValidated,
      updatePasswordSuccesses,
    } = this.state;
    return (
      <ProfileControllerView
        username={username}
        createdAt={createdAt}
        updatedAt={updatedAt}
        sortedEmails={sortedEmails}
        exactHumanCreatedAgo={exactHumanCreatedAgo}
        exactHumanUpdatedAgo={exactHumanUpdatedAgo}
        errors={errors}
        addEmailInput={addEmailInput}
        addEmailErrors={addEmailErrors}
        emailValidated={emailValidated}
        loading={loading}
        loadingText={loadingText}
        changeEmailSuccesses={changeEmailSuccesses}
        oldPassword={password}
        oldPasswordErrors={oldPasswordErrors}
        newPassword={newPassword}
        newPasswordErrors={newPasswordErrors}
        newPasswordValidated={newPasswordValidated}
        updatePasswordSuccesses={updatePasswordSuccesses}
        handleAddEmailSubmit={this.handleAddEmailSubmit}
        handleChangeAddEmail={this.handleChangeAddEmail}
        handleEmailBlur={this.handleEmailBlur}
        handleResendVerification={this.handleResendVerification}
        handleSetAsPrimary={this.handleSetAsPrimary}
        handleDeleteEmail={this.handleDeleteEmail}
        handleNewPasswordSubmit={this.handleNewPasswordSubmit}
        handleNewPasswordBlur={this.handleNewPasswordBlur}
        handleChangeOldPassword={this.handleChangeOldPassword}
        handleChangeNewPassword={this.handleChangeNewPassword}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    username: AuthSelectors.getSelfUsername(state),
    createdAt: AuthSelectors.getSelfCreatedAt(state),
    updatedAt: AuthSelectors.getSelfUpdatedAt(state),
    emails: AuthSelectors.getSelfEmails(state),
    password: state.auth.password,
  };
}

export default connect(mapStateToProps)(withApollo(ProfileController));
