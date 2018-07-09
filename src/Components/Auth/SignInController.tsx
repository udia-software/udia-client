import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import React, {
  ChangeEventHandler,
  Component,
  FormEventHandler,
  MouseEventHandler
} from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import {
  setAuthData,
  setFormEmail,
  setFormPassword
} from "../../Modules/Reducers/Auth/Actions";
import {
  setBase64AK,
  setBase64MK
} from "../../Modules/Reducers/Secrets/Actions";
import { FullUser, isMountable } from "../../Types";
import parseGraphQLError from "../PureHelpers/ParseGraphQLError";
import SignInView from "./SignInView";

interface IProps {
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  email: string;
  password: string;
}

interface IState {
  loading: boolean;
  loadingText?: string;
  errors: string[];
  emailErrors: string[];
  passwordErrors: string[];
  cryptoManager: CryptoManager | null;
  showPassword: boolean;
}

class SignInController extends Component<IProps, IState>
  implements isMountable {
  public isMountableMounted = false;

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
      cryptoManager,
      showPassword: false
    };
  }

  public componentDidMount() {
    this.isMountableMounted = true;
  }

  public componentWillUnmount() {
    this.isMountableMounted = false;
  }

  public render() {
    const {
      loading,
      loadingText,
      errors,
      passwordErrors,
      emailErrors,
      showPassword
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
        showPassword={showPassword}
        handleChangeEmail={this.handleChangeEmail}
        handleChangePassword={this.handleChangePassword}
        handleTogglePassword={this.handleTogglePassword}
        handleSubmit={this.handleSubmit}
      />
    );
  }

  protected handleChangeEmail: ChangeEventHandler<HTMLInputElement> = e => {
    if (!this.state.loading) {
      this.props.dispatch(setFormEmail(e.currentTarget.value));
      this.setState({ emailErrors: [] });
    }
  };

  protected handleChangePassword: ChangeEventHandler<HTMLInputElement> = e => {
    if (!this.state.loading) {
      this.props.dispatch(setFormPassword(e.target.value));
      this.setState({ passwordErrors: [] });
    }
  };

  protected handleTogglePassword: MouseEventHandler<HTMLAnchorElement> = e => {
    if (!this.state.loading) {
      this.setState({ showPassword: !this.state.showPassword });
    }
  };

  protected handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
    if (this.state.loading) {
      return;
    }
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
        showPassword: false,
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
      dispatch(setBase64MK(Buffer.from(derivedBufferOutput.mk).toString("base64")));
      dispatch(setBase64AK(Buffer.from(derivedBufferOutput.ak).toString("base64")));
      dispatch(setAuthData({ user, jwt }));
    } catch (err) {
      const { errors, emailErrors, passwordErrors } = parseGraphQLError(
        err,
        "Failed to sign in!"
      );
      this.setState({
        errors,
        emailErrors,
        passwordErrors
      });
    } finally {
      if (this.isMountableMounted) {
        this.setState({
          loading: false,
          loadingText: undefined
        });
      }
    }
  };
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

const mapStateToProps = (state: IRootState) => ({
  email: state.auth.email,
  password: state.auth.password
});

export default connect(mapStateToProps)(withApollo(SignInController));
