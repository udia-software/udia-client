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
import TimeHelper from '../../Modules/TimeHelper';

type Props = {
  client: ApolloClient,
  dispatch: Dispatch,
  username: string,
  createdAt: Date,
  updatedAt: Date,
  emails: any[],
};

type State = {
  tickIntervalID: IntervalID,
  exactHumanCreatedAgo: string,
  exactHumanUpdatedAgo: string,
  errors: string[],
  addEmailInput: string,
  addEmailErrors: string[],
  emailValidated: boolean,
  changingEmails: boolean,
  changeEmailSuccesses: string[],
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
      changingEmails: false,
      changeEmailSuccesses: [],
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
      changingEmails: false,
      addEmailErrors: [],
      errors: [],
    });
  };

  handleEmailBlur = async () => {
    const { client } = this.props;
    const { addEmailInput } = this.state;
    this.setState({ emailValidated: false, changingEmails: false });
    try {
      await client.query({
        query: CHECK_EMAIL_EXISTS,
        variables: { email: addEmailInput },
      });
      this.setState({ emailValidated: true, changingEmails: false });
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
        changingEmails: false,
      });
    }
  };

  handleAddEmailSubmit = async (event: SyntheticEvent<any>) => {
    event.preventDefault();
    const { client, dispatch } = this.props;
    const { addEmailInput } = this.state;
    this.setState({
      emailValidated: false,
      changingEmails: true,
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
        changingEmails: false,
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
        changingEmails: false,
      });
    }
  };

  handleResendVerification = (email: string) => async (e: SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { client } = this.props;
    this.setState({
      errors: [],
      addEmailErrors: [],
      changingEmails: true,
      changeEmailSuccesses: [],
    });
    try {
      await client.mutate({
        mutation: SEND_VERIFICATION_EMAIL_MUTATION,
        variables: { email },
      });
      this.setState({
        changingEmails: false,
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
        changingEmails: false,
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
      changingEmails: true,
      changeEmailSuccesses: [],
    });
    try {
      const { data } = await client.mutate({
        mutation: SET_PRIMARY_EMAIL_MUTATION,
        variables: { email },
      });
      dispatch(AuthActions.setAuthUser(data.setPrimaryEmail));
      this.setState({
        changingEmails: false,
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
        changingEmails: false,
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
      changingEmails: true,
      changeEmailSuccesses: [],
    });
    try {
      const { data } = await client.mutate({
        mutation: REMOVE_EMAIL_MUTATION,
        variables: { email },
      });
      dispatch(AuthActions.setAuthUser(data.removeEmail));
      this.setState({
        changingEmails: false,
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
        changingEmails: false,
        changeEmailSuccesses: [],
      });
    }
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
      username, createdAt, updatedAt, emails,
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
      changingEmails,
      changeEmailSuccesses,
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
        changingEmails={changingEmails}
        changeEmailSuccesses={changeEmailSuccesses}
        handleAddEmailSubmit={this.handleAddEmailSubmit}
        handleChangeAddEmail={this.handleChangeAddEmail}
        handleEmailBlur={this.handleEmailBlur}
        handleResendVerification={this.handleResendVerification}
        handleSetAsPrimary={this.handleSetAsPrimary}
        handleDeleteEmail={this.handleDeleteEmail}
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
  };
}

export default connect(mapStateToProps)(withApollo(ProfileController));
