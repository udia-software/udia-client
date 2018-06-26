import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { GraphQLError } from "graphql";
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
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import {
  setAuthData,
  setFormEmail,
  setFormPassword,
  setFormUsername
} from "../../Modules/Reducers/Auth/Actions";
import { IRootState } from "../../Modules/Reducers/RootReducer";
import { FullUser, isMountable } from "../../Types";
import SignUpView from "./SignUpView";

export interface IProps {
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  email: string;
  username: string;
  password: string;
}

export interface IState {
  loading: boolean;
  loadingText?: string;
  emailValidating: boolean;
  emailValidated: boolean;
  usernameValidating: boolean;
  usernameValidated: boolean;
  passwordValidated: boolean;
  errors: string[];
  emailErrors: string[];
  usernameErrors: string[];
  passwordErrors: string[];
  cryptoManager: CryptoManager | null;
  showPassword: boolean;
}

const CHECK_EMAIL_EXISTS = gql`
  query CheckEmailExists($email: String!) {
    checkEmailExists(email: $email)
  }
`;

const CHECK_USERNAME_EXISTS = gql`
  query CheckUsernameExists($username: String!) {
    checkUsernameExists(username: $username)
  }
`;

const SIGN_UP_MUTATION = gql`
  mutation CreateUserMutation(
    $username: String!
    $email: String!
    $pw: String!
    $pwFunc: String!
    $pwDigest: String!
    $pwCost: Int!
    $pwKeySize: Int!
    $pwNonce: String!
    $pubVerifyKey: String!
    $encPrivateSignKey: String!
    $encSecretKey: String!
    $pubEncryptKey: String!
    $encPrivateDecryptKey: String!
  ) {
    createUser(
      username: $username
      email: $email
      pw: $pw
      pwFunc: $pwFunc
      pwDigest: $pwDigest
      pwCost: $pwCost
      pwKeySize: $pwKeySize
      pwNonce: $pwNonce
      pubVerifyKey: $pubVerifyKey
      encPrivateSignKey: $encPrivateSignKey
      encSecretKey: $encSecretKey
      pubEncryptKey: $pubEncryptKey
      encPrivateDecryptKey: $encPrivateDecryptKey
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

interface ISignUpMutationResponse {
  createUser: {
    jwt: string;
    user: FullUser;
  };
}

class SignUpController extends Component<IProps, IState>
  implements isMountable {
  public isMountableMounted = false;

  constructor(props: IProps) {
    super(props);
    document.title = "Sign Up - UDIA";
    const errors: string[] = [];
    let cryptoManager: CryptoManager | null = null;
    try {
      cryptoManager = new CryptoManager();
    } catch (err) {
      errors.push(err.message);
    }
    this.state = {
      loading: false,
      emailValidating: false,
      emailValidated: false,
      usernameValidating: false,
      usernameValidated: false,
      passwordValidated: false,
      errors,
      emailErrors: [],
      usernameErrors: [],
      passwordErrors: [],
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
    const { email, username, password } = this.props;
    const {
      loading,
      loadingText,
      emailValidating,
      emailValidated,
      usernameValidating,
      usernameValidated,
      passwordValidated,
      errors,
      emailErrors,
      usernameErrors,
      passwordErrors,
      showPassword
    } = this.state;
    return (
      <SignUpView
        loading={loading}
        loadingText={loadingText}
        emailValidating={emailValidating}
        emailValidated={emailValidated}
        usernameValidating={usernameValidating}
        usernameValidated={usernameValidated}
        passwordValidated={passwordValidated}
        email={email}
        username={username}
        password={password}
        errors={errors}
        emailErrors={emailErrors}
        usernameErrors={usernameErrors}
        passwordErrors={passwordErrors}
        showPassword={showPassword}
        handleChangeEmail={this.handleChangeEmail}
        handleEmailBlur={this.handleEmailBlur}
        handleChangeUsername={this.handleChangeUsername}
        handleUsernameBlur={this.handleUNameBlur}
        handleChangePassword={this.handleChangePassword}
        handlePasswordBlur={this.handlePasswordBlur}
        handleTogglePassword={this.handleTogglePassword}
        handleSubmit={this.handleSubmit}
      />
    );
  }

  protected handleChangeEmail: ChangeEventHandler<HTMLInputElement> = e => {
    if (!this.state.loading) {
      this.props.dispatch(setFormEmail(e.currentTarget.value));
      this.setState({ emailErrors: [], emailValidated: false });
    }
  };

  protected handleEmailBlur: FocusEventHandler<HTMLInputElement> = async () => {
    const { client, email } = this.props;
    if (this.isMountableMounted) {
      this.setState({ emailValidated: false, emailValidating: true });
    }
    try {
      await client.query({
        query: CHECK_EMAIL_EXISTS,
        variables: { email }
      });
      if (this.isMountableMounted) {
        this.setState({ emailValidated: true });
      }
    } catch (err) {
      const { graphQLErrors, networkError, message } = err;
      const errors: string[] = [];
      let emailErrors: string[] = [];
      if (graphQLErrors && graphQLErrors.length) {
        graphQLErrors.forEach(
          (graphQLError: GraphQLError & { state: { email?: string[] } }) => {
            const errorState = graphQLError.state || {};
            emailErrors = emailErrors.concat(errorState.email || []);
          }
        );
      }
      const catchAll = emailErrors.length === 0;
      if (networkError || catchAll) {
        // tslint:disable-next-line:no-console
        console.warn(err);
        errors.push(message || "Failed to check email!");
      }
      if (this.isMountableMounted) {
        this.setState({
          errors,
          emailErrors,
          emailValidated: false
        });
      }
    } finally {
      if (this.isMountableMounted) {
        this.setState({
          emailValidating: false
        });
      }
    }
  };

  protected handleChangeUsername: ChangeEventHandler<HTMLInputElement> = e => {
    if (!this.state.loading) {
      this.props.dispatch(setFormUsername(e.currentTarget.value));
      this.setState({ usernameErrors: [], usernameValidated: false });
    }
  };

  protected handleUNameBlur: FocusEventHandler<HTMLInputElement> = async () => {
    const { client, username } = this.props;
    if (this.isMountableMounted) {
      this.setState({ usernameValidated: false, usernameValidating: true });
    }
    try {
      await client.query({
        query: CHECK_USERNAME_EXISTS,
        variables: { username }
      });
      if (this.isMountableMounted) {
        this.setState({ usernameValidated: true });
      }
    } catch (err) {
      const { graphQLErrors, networkError, message } = err;
      const errors: string[] = [];
      let usernameErrors: string[] = [];
      if (graphQLErrors && graphQLErrors.length) {
        graphQLErrors.forEach(
          (graphQLError: GraphQLError & { state: { username?: string[] } }) => {
            const errorState = graphQLError.state || {};
            usernameErrors = usernameErrors.concat(errorState.username || []);
          }
        );
      }
      const catchAll = usernameErrors.length === 0;
      if (networkError || catchAll) {
        // tslint:disable-next-line:no-console
        console.warn(err);
        errors.push(message || "Failed to check username!");
      }
      if (this.isMountableMounted) {
        this.setState({
          errors,
          usernameErrors,
          usernameValidated: false
        });
      }
    } finally {
      if (this.isMountableMounted) {
        this.setState({
          usernameValidating: false
        });
      }
    }
  };

  protected handleChangePassword: ChangeEventHandler<HTMLInputElement> = e => {
    if (!this.state.loading) {
      this.props.dispatch(setFormPassword(e.target.value));
      this.setState({ passwordErrors: [], passwordValidated: false });
    }
  };

  protected handlePasswordBlur: FocusEventHandler<HTMLInputElement> = () => {
    this.validatePassword();
  };

  protected handleTogglePassword: MouseEventHandler<HTMLAnchorElement> = e => {
    if (this.isMountableMounted) {
      this.setState({
        showPassword: !this.state.showPassword,
        passwordErrors: [],
        passwordValidated: false
      });
    }
  };

  protected handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
    try {
      e.preventDefault();
      const { client, dispatch, email, username, password } = this.props;
      const {
        cryptoManager,
        usernameErrors,
        emailErrors,
        passwordErrors
      } = this.state;

      // Last quick sanitization
      if (!cryptoManager) {
        throw new Error("Browser does not support WebCrypto!");
      }
      const passwordOK = this.validatePassword();
      if (
        !passwordOK ||
        usernameErrors.length > 0 ||
        emailErrors.length > 0 ||
        passwordErrors.length > 0
      ) {
        return;
      }

      // Derive secure master key buffers
      this.setState({
        loading: true,
        loadingText: "Deriving master password...",
        showPassword: false,
        errors: [],
        emailErrors: [],
        usernameErrors: [],
        passwordErrors: []
      });
      const derivedBufferOutput = await cryptoManager.deriveMasterKeyBuffers({
        userInputtedPassword: password
      });
      const { mk, ak } = derivedBufferOutput;
      const mkBuf = Buffer.from(mk);
      const akBuf = Buffer.from(ak);
      const pw = Buffer.from(derivedBufferOutput.pw).toString("base64");
      const pwNonce = Buffer.from(derivedBufferOutput.pwNonce).toString(
        "base64"
      );

      // Generate symmetric encryption key
      this.setState({ loadingText: "Generating symmetric encryption key..." });
      const secretKey = await cryptoManager.generateSymmetricEncryptionKey();
      const secretJWK = await cryptoManager.exportJsonWebKey(secretKey);
      const serializedSecretJWK = JSON.stringify(secretJWK);
      const secretKeyBuf = Buffer.from(serializedSecretJWK, "utf8").buffer;
      const secretKeySecret = Buffer.concat([mkBuf, akBuf]).buffer;
      const encSecretKey = await cryptoManager.encryptWithSecret(
        secretKeyBuf,
        secretKeySecret
      );

      // Generate asymmetric signing key pair
      this.setState({
        loadingText: "Generating asymmetric signing key pair..."
      });
      const signKeyPair = await cryptoManager.generateAsymmetricSigningKeyPair();
      const pubVerJWK = await cryptoManager.exportJsonWebKey(
        signKeyPair.publicKey
      );
      const serializedPubVerKey = JSON.stringify(pubVerJWK);
      const privSignJWK = await cryptoManager.exportJsonWebKey(
        signKeyPair.privateKey
      );
      const serializedPrivSignKey = JSON.stringify(privSignJWK);
      const encPrivateSignKey = await cryptoManager.encryptWithSecret(
        Buffer.from(serializedPrivSignKey, "utf8").buffer,
        ak
      );

      // Generate asymmetric encryption key pair
      this.setState({
        loadingText: "Generating asymmetric encryption key pair..."
      });
      const encKeyPair = await cryptoManager.generateAsymmetricEncryptionKeyPair();
      const pubEncJWK = await cryptoManager.exportJsonWebKey(
        encKeyPair.publicKey
      );
      const serializedPubEncKey = JSON.stringify(pubEncJWK);
      const privDecJWK = await cryptoManager.exportJsonWebKey(
        encKeyPair.privateKey
      );
      const serializedPrivDecKey = JSON.stringify(privDecJWK);
      const encPrivateDecryptKey = await cryptoManager.encryptWithSecret(
        Buffer.from(serializedPrivDecKey, "utf8").buffer,
        mk
      );

      // Communicate with the server to sign up
      this.setState({ loadingText: "Communicating with server..." });
      const mutationResponse = await client.mutate<ISignUpMutationResponse>({
        mutation: SIGN_UP_MUTATION,
        variables: {
          username,
          email,
          pw,
          pwFunc: derivedBufferOutput.pwFunc,
          pwDigest: derivedBufferOutput.pwDigest,
          pwCost: derivedBufferOutput.pwCost,
          pwKeySize: derivedBufferOutput.pwKeySize,
          pwNonce,
          pubVerifyKey: serializedPubVerKey,
          encPrivateSignKey,
          encSecretKey,
          pubEncryptKey: serializedPubEncKey,
          encPrivateDecryptKey
        }
      });
      const {
        createUser: { jwt, user }
      } = mutationResponse.data as ISignUpMutationResponse;

      // Set up the client given the successful response
      this.setState({ loadingText: "Setting up client..." });
      dispatch(setAuthData({ jwt, user }));
    } catch (err) {
      const { graphQLErrors, networkError, message } = err;
      const errors: string[] = [];
      let emailErrors: string[] = [];
      let usernameErrors: string[] = [];
      let passwordErrors: string[] = [];

      if (graphQLErrors && graphQLErrors.length) {
        graphQLErrors.forEach(
          (
            graphQLError: GraphQLError & {
              state: { email?: string[]; pw?: string[]; username?: string[] };
            }
          ) => {
            const errorState = graphQLError.state || {};
            emailErrors = emailErrors.concat(errorState.email || []);
            usernameErrors = usernameErrors.concat(errorState.username || []);
            passwordErrors = passwordErrors.concat(errorState.pw || []);
          }
        );
      }
      const catchAll =
        emailErrors.length === 0 &&
        passwordErrors.length === 0 &&
        usernameErrors.length === 0;
      if (networkError || catchAll) {
        // tslint:disable-next-line:no-console
        console.warn(err);
        errors.push(message || "Failed to sign up!");
      }
      this.setState({
        errors,
        emailErrors,
        usernameErrors,
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

  private validatePassword = () => {
    const { password } = this.props;
    const { cryptoManager } = this.state;
    if (cryptoManager) {
      const errors = cryptoManager.validateUserInputtedPassword(password);
      if (errors.length > 0) {
        if (this.isMountableMounted) {
          this.setState({
            passwordErrors: errors,
            passwordValidated: false
          });
        }
      } else {
        if (this.isMountableMounted) {
          this.setState({
            passwordErrors: [],
            passwordValidated: true
          });
        }
        return true;
      }
    }
    return false;
  };
}

function mapStateToProps(state: IRootState) {
  return {
    email: state.auth.email,
    username: state.auth.username,
    password: state.auth.password
  };
}

export default connect(mapStateToProps)(withApollo(SignUpController));
