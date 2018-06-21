import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { GraphQLError } from "graphql";
import gql from "graphql-tag";
import React, { ChangeEventHandler, Component, FormEventHandler } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import {
  setAuthData,
  setFormEmail,
  setFormPassword
} from "../../Modules/Reducers/Auth/Actions";
import { IRootState } from "../../Modules/Reducers/RootReducer";
import { FullUser } from "../../Types";
import SignInView from "./SignInView";

export interface IProps {
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  email: string;
  password: string;
}

export interface IState {
  loading: boolean;
  loadingText?: string;
  errors: string[];
  emailErrors: string[];
  passwordErrors: string[];
  cryptoManager: CryptoManager | null;
}

const SIGN_IN_MUTATION = gql`
  mutation SignInMutation($email: String!, $pw: String!) {
    signInUser(email: $email, pw: $pw) {
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
        encSecretKey
        pubSignKey
        encPrivSignKey
        pubEncKey
        encPrivEncKey
        pwFunc
        pwDigest
        pwCost
        pwKeySize
        pwNonce
        createdAt
        updatedAt
      }
    }
  }
`;

interface ISignInMutationResponse {
  signInUser: {
    jwt: string;
    user: FullUser;
  };
}

const GET_AUTH_PARAMS_QUERY = gql`
  query GetAuthParamsQuery($email: String!) {
    getUserAuthParams(email: $email) {
      pwFunc
      pwDigest
      pwCost
      pwKeySize
      pwNonce
    }
  }
`;

interface IGetAuthParamsQueryResponse {
  getUserAuthParams: {
    pwFunc: string;
    pwDigest: string;
    pwCost: number;
    pwKeySize: number;
    pwNonce: string;
  };
}

class SignInController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "Sign In - UDIA";
    const errors: string[] = [];
    let cryptoManager: CryptoManager | null = null;
    try {
      cryptoManager = new CryptoManager();
    } catch (err) {
      errors.push(err.message);
    }

    this.state = {
      errors,
      emailErrors: [],
      passwordErrors: [],
      loading: false,
      cryptoManager
    };
  }

  public render() {
    const {
      loading,
      loadingText,
      errors,
      passwordErrors,
      emailErrors
    } = this.state;
    const { email, password } = this.props;
    return (
      <SignInView
        loading={loading}
        loadingText={loadingText}
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
  }

  protected handleChangeEmail: ChangeEventHandler<HTMLInputElement> = e => {
    this.props.dispatch(setFormEmail(e.currentTarget.value));
    this.setState({ emailErrors: [] });
  };

  protected handleChangePassword: ChangeEventHandler<HTMLInputElement> = e => {
    this.props.dispatch(setFormPassword(e.target.value));
    this.setState({ passwordErrors: [] });
  };

  protected handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
    try {
      e.preventDefault();
      const { client, dispatch, email, password } = this.props;
      const { cryptoManager } = this.state;

      if (!cryptoManager) {
        throw new Error("Browser does not support WebCrypto!");
      }

      // Fetch authentication parameters
      this.setState({
        loading: true,
        loadingText: "Fetching auth params...",
        errors: [],
        emailErrors: [],
        passwordErrors: []
      });
      const queryResponse = await client.query<IGetAuthParamsQueryResponse>({
        query: GET_AUTH_PARAMS_QUERY,
        variables: { email }
      });
      const {
        data: {
          getUserAuthParams: { pwNonce, pwCost, pwKeySize, pwDigest, pwFunc }
        }
      } = queryResponse;

      // Derive secure master key buffers
      this.setState({
        loadingText: "Deriving master password..."
      });
      const derivedBufferOutput = await cryptoManager.deriveMasterKeyBuffers({
        userInputtedPassword: password,
        pwNonce,
        pwCost,
        pwKeySize,
        pwDigest,
        pwFunc
      });
      const pw = Buffer.from(derivedBufferOutput.pw).toString("base64");

      // Communicate with the server to sign in
      this.setState({ loadingText: "Communicating with server..." });
      const mutationResponse = await client.mutate<ISignInMutationResponse>({
        mutation: SIGN_IN_MUTATION,
        variables: { email, pw }
      });
      const {
        signInUser: { jwt, user }
      } = mutationResponse.data as ISignInMutationResponse;

      // Set up the client given the successful response
      this.setState({ loadingText: "Setting up client..." });
      dispatch(setAuthData({ user, jwt }));
    } catch (err) {
      const { graphQLErrors, networkError, message } = err;
      const errors: string[] = [];
      let emailErrors: string[] = [];
      let passwordErrors: string[] = [];
      if (graphQLErrors && graphQLErrors.length) {
        graphQLErrors.forEach(
          (
            graphQLError: GraphQLError & {
              state: { email?: string[]; pw?: string[] };
            }
          ) => {
            const errorState = graphQLError.state || {};
            emailErrors = emailErrors.concat(errorState.email || []);
            passwordErrors = passwordErrors.concat(errorState.pw || []);
          }
        );
      }
      const catchAll = emailErrors.length === 0 && passwordErrors.length === 0;
      if (networkError || catchAll) {
        // tslint:disable-next-line:no-console
        console.warn(err);
        errors.push(message || "Failed to sign in!");
      }
      this.setState({
        errors,
        emailErrors,
        passwordErrors
      });
    } finally {
      this.setState({
        loading: false,
        loadingText: undefined
      });
    }
  };
}

function mapStateToProps(state: IRootState) {
  return {
    email: state.auth.email,
    password: state.auth.password
  };
}

export default connect(mapStateToProps)(withApollo(SignInController));
