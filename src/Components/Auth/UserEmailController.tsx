import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import React, {
  ChangeEventHandler,
  Component,
  FocusEventHandler,
  FormEventHandler,
  MouseEventHandler
} from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { setAuthUser, setFormEmail } from "../../Modules/Reducers/Auth/Actions";
import parseGraphQLError from "../Helpers/ParseGraphQLError";

import UserEmailView from "./UserEmailView";

interface IProps {
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  formEmail: string;
  user: FullUser;
}

interface IState {
  loading: boolean;
  loadingText?: string;
  emailValidating: boolean;
  errors: string[];
  formEmailErrors: string[];
  userEmailErrors: string[];
  emailSuccess: boolean | string;
}

class UserEmailController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "Emails - UDIA";
    this.state = {
      loading: false,
      emailValidating: false,
      emailSuccess: false,
      errors: [],
      formEmailErrors: [],
      userEmailErrors: []
    };
  }

  public render() {
    const { formEmail, user } = this.props;
    const {
      loading,
      loadingText,
      emailValidating,
      emailSuccess,
      errors,
      formEmailErrors,
      userEmailErrors
    } = this.state;
    return (
      <UserEmailView
        loading={loading}
        loadingText={loadingText}
        emailValidating={emailValidating}
        emailSuccess={emailSuccess}
        formEmail={formEmail}
        user={user}
        errors={errors}
        formEmailErrors={formEmailErrors}
        userEmailErrors={userEmailErrors}
        handleChangeEmail={this.handleChangeEmail}
        handleEmailBlur={this.handleEmailBlur}
        handleAddEmail={this.handleAddEmail}
        handleRemoveEmail={this.handleRemoveEmail}
        handleSetPrimaryEmail={this.handleSetPrimaryEmail}
        handleSendEmailVerification={this.handleSendEmailVerification}
      />
    );
  }

  protected handleChangeEmail: ChangeEventHandler<HTMLInputElement> = e => {
    if (!this.state.loading) {
      this.props.dispatch(setFormEmail(e.currentTarget.value));
      this.setState({ formEmailErrors: [], emailSuccess: false });
    }
  };

  protected handleEmailBlur: FocusEventHandler<HTMLInputElement> = async () => {
    const { client, formEmail } = this.props;
    if (!formEmail) {
      return;
    }
    this.setState({ emailSuccess: false, emailValidating: true });
    try {
      await client.query({
        query: CHECK_EMAIL_EXISTS,
        variables: { email: formEmail }
      });
      this.setState({ emailSuccess: true });
    } catch (err) {
      const { errors, emailErrors: formEmailErrors } = parseGraphQLError(
        err,
        "Failed to check email!"
      );
      this.setState({
        errors,
        formEmailErrors,
        emailSuccess: true
      });
    } finally {
      this.setState({
        emailValidating: false
      });
    }
  };

  protected handleAddEmail: FormEventHandler<HTMLFormElement> = async e => {
    try {
      e.preventDefault();
      const { client, dispatch, formEmail } = this.props;
      const { formEmailErrors } = this.state;
      if (formEmailErrors.length > 0) {
        return;
      }
      this.setState({
        loading: true,
        loadingText: "Adding email...",
        emailSuccess: false,
        formEmailErrors: [],
        userEmailErrors: []
      });
      const addEmailResponse = await client.mutate<IAddEmailResponse>({
        mutation: ADD_EMAIL_MUTATION,
        variables: { email: formEmail }
      });
      const data = addEmailResponse.data as IAddEmailResponse;
      dispatch(setFormEmail(""));
      dispatch(setAuthUser(data.addEmail));
      this.setState({
        emailSuccess: `Added email: ${formEmail}.`
      });
    } catch (err) {
      const { errors, emailErrors: formEmailErrors } = parseGraphQLError(
        err,
        "Failed to add email!"
      );
      this.setState({
        errors,
        formEmailErrors
      });
    } finally {
      this.setState({
        loading: false,
        loadingText: undefined
      });
    }
  };

  protected handleRemoveEmail: (
    email: string
  ) => MouseEventHandler<HTMLAnchorElement> = email => async e => {
    try {
      e.preventDefault();
      const { client, dispatch } = this.props;
      this.setState({
        loading: true,
        loadingText: "Removing email...",
        emailSuccess: false,
        formEmailErrors: [],
        userEmailErrors: []
      });
      const deleteEmailResponse = await client.mutate<IRemoveEmailResponse>({
        mutation: REMOVE_EMAIL_MUTATION,
        variables: { email }
      });
      const data = deleteEmailResponse.data as IRemoveEmailResponse;
      dispatch(setAuthUser(data.removeEmail));
      this.setState({
        emailSuccess: `Removed email: ${email}.`
      });
    } catch (err) {
      const { errors, emailErrors: userEmailErrors } = parseGraphQLError(
        err,
        "Failed to remove email!"
      );
      this.setState({
        errors,
        userEmailErrors
      });
    } finally {
      this.setState({
        loading: false,
        loadingText: undefined
      });
    }
  };

  protected handleSetPrimaryEmail: (
    email: string
  ) => MouseEventHandler<HTMLAnchorElement> = email => async e => {
    try {
      e.preventDefault();
      const { client, dispatch } = this.props;
      this.setState({
        loading: true,
        loadingText: "Setting primary email...",
        emailSuccess: false,
        formEmailErrors: [],
        userEmailErrors: []
      });
      const setPrimaryEmailResponse = await client.mutate<
        ISetPrimaryEmailResponse
      >({
        mutation: SET_PRIMARY_EMAIL_MUTATION,
        variables: { email }
      });
      const data = setPrimaryEmailResponse.data as ISetPrimaryEmailResponse;
      dispatch(setAuthUser(data.setPrimaryEmail));
      this.setState({
        emailSuccess: `Set primary email: ${email}.`
      });
    } catch (err) {
      const { errors, emailErrors: userEmailErrors } = parseGraphQLError(
        err,
        "Failed to set primary email!"
      );
      this.setState({
        errors,
        userEmailErrors
      });
    } finally {
      this.setState({
        loading: false,
        loadingText: undefined
      });
    }
  };

  protected handleSendEmailVerification: (
    email: string
  ) => MouseEventHandler<HTMLAnchorElement> = email => async e => {
    try {
      e.preventDefault();
      const { client } = this.props;
      this.setState({
        loading: true,
        loadingText: "Sending email verification...",
        emailSuccess: false,
        formEmailErrors: [],
        userEmailErrors: []
      });
      await client.mutate({
        mutation: SEND_EMAIL_VERIFICATION_MUTATION,
        variables: { email }
      });
      this.setState({
        emailSuccess: `Sent email verification: ${email}.`
      });
    } catch (err) {
      const { errors, emailErrors: userEmailErrors } = parseGraphQLError(
        err,
        "Failed to send email verification!"
      );
      this.setState({
        errors,
        userEmailErrors
      });
    } finally {
      this.setState({
        loading: false,
        loadingText: undefined
      });
    }
  };
}

const CHECK_EMAIL_EXISTS = gql`
  query CheckEmailExists($email: String!) {
    checkEmailExists(email: $email)
  }
`;

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
      encSecretKey
      pubVerifyKey
      encPrivateSignKey
      pubEncryptKey
      encPrivateDecryptKey
      pwFunc
      pwDigest
      pwCost
      pwKeySize
      pwNonce
      createdAt
      updatedAt
    }
  }
`;

interface IAddEmailResponse {
  addEmail: FullUser;
}

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
      encSecretKey
      pubVerifyKey
      encPrivateSignKey
      pubEncryptKey
      encPrivateDecryptKey
      pwFunc
      pwDigest
      pwCost
      pwKeySize
      pwNonce
      createdAt
      updatedAt
    }
  }
`;

interface IRemoveEmailResponse {
  removeEmail: FullUser;
}

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
      encSecretKey
      pubVerifyKey
      encPrivateSignKey
      pubEncryptKey
      encPrivateDecryptKey
      pwFunc
      pwDigest
      pwCost
      pwKeySize
      pwNonce
      createdAt
      updatedAt
    }
  }
`;

interface ISetPrimaryEmailResponse {
  setPrimaryEmail: FullUser;
}

const SEND_EMAIL_VERIFICATION_MUTATION = gql`
  mutation SendEmailVerification($email: String!) {
    sendEmailVerification(email: $email)
  }
`;

const mapStateToProps = (state: IRootState) => ({
  formEmail: state.auth.email,
  user: state.auth.authUser! // User is always defined here, thanks to WithAuth wrapper
});

export default connect(mapStateToProps)(withApollo(UserEmailController));
