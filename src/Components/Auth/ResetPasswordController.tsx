import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import { DateTime } from "luxon";
import React, { Component, FocusEventHandler, FormEventHandler } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { match } from "react-router";
import { Dispatch } from "redux";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import {
  setAuthData,
  setFormPassword,
  setFormPasswordResetToken
} from "../../Modules/Reducers/Auth/Actions";
import { IRootState } from "../../Modules/Reducers/RootReducer";
import {
  setBase64AK,
  setBase64MK
} from "../../Modules/Reducers/Secrets/Actions";
import { FullUser, isMountable } from "../../Types";
import parseGraphQLError from "../PureHelpers/ParseGraphQLError";
import ResetPasswordView from "./ResetPasswordView";

interface IProps {
  dispatch: Dispatch;
  match: match<{ verificationToken?: string }>;
  client: ApolloClient<NormalizedCacheObject>;
  passwordResetToken: string;
  password: string;
}

interface IState {
  loading: boolean;
  loadingText?: string;
  errors: string[];
  resetTokenErrors: string[];
  tokenVerifying: boolean;
  tokenVerified: boolean;
  acknowledgedLoss: boolean;
  tokenExpiry?: number;
  humanizedDuration?: string;
  tokenValidityTick?: number;
  passwordValidated: boolean;
  passwordErrors: string[];
  cryptoManager: CryptoManager | null;
  showPassword: boolean;
}

class ResetPasswordController extends Component<IProps, IState>
  implements isMountable {
  public isMountableMounted = false;
  constructor(props: IProps) {
    super(props);
    document.title = "Reset Password - UDIA";
    const errors: string[] = [];
    let cryptoManager: CryptoManager | null = null;
    try {
      cryptoManager = new CryptoManager();
    } catch (err) {
      errors.push(err.message);
    }
    this.state = {
      loading: false,
      errors: [],
      resetTokenErrors: [],
      tokenVerifying: false,
      tokenVerified: false,
      passwordValidated: false,
      passwordErrors: [],
      acknowledgedLoss: false,
      cryptoManager,
      showPassword: false
    };
  }

  public async componentDidMount() {
    this.isMountableMounted = true;
    const urlVerificationToken =
      this.props.match.params.verificationToken || "";
    if (urlVerificationToken) {
      this.props.dispatch(setFormPasswordResetToken(urlVerificationToken));
      await this.handleCheckResetToken(urlVerificationToken);
    }
  }

  public componentWillUnmount() {
    clearInterval(this.state.tokenValidityTick);
    this.isMountableMounted = false;
  }

  public render() {
    const { passwordResetToken, password } = this.props;
    const {
      loading,
      loadingText,
      errors,
      resetTokenErrors,
      tokenVerifying,
      tokenVerified,
      humanizedDuration,
      passwordValidated,
      passwordErrors,
      acknowledgedLoss
    } = this.state;

    return (
      <ResetPasswordView
        loading={loading}
        loadingText={loadingText}
        errors={errors}
        token={passwordResetToken}
        tokenVerifying={tokenVerifying}
        tokenVerified={tokenVerified}
        tokenErrors={resetTokenErrors}
        humanizedDuration={humanizedDuration}
        password={password}
        passwordValidated={passwordValidated}
        passwordErrors={passwordErrors}
        acknowledgedLoss={acknowledgedLoss}
        handleChangeVerificationToken={this.handleChangePasswordResetToken}
        handleCheckPasswordResetToken={this.handleResetTokenBlur}
        handleChangePassword={this.handleChangePassword}
        handleAcknowledgedLoss={this.handleAcknowledgedLoss}
        handleVerifyPassword={this.validatePassword}
        handleSubmit={this.handleSubmit}
      />
    );
  }

  protected handleChangePasswordResetToken: FormEventHandler<
    HTMLInputElement
  > = e => {
    this.props.dispatch(setFormPasswordResetToken(e.currentTarget.value));
    this.setState({
      resetTokenErrors: [],
      tokenVerifying: false,
      tokenVerified: false,
      tokenExpiry: undefined,
      humanizedDuration: undefined
    });
  };

  protected handleResetTokenBlur: FocusEventHandler<
    HTMLInputElement
  > = async e => {
    e.preventDefault();
    const { passwordResetToken } = this.props;
    await this.handleCheckResetToken(passwordResetToken);
  };

  protected handleCheckResetToken = async (rawToken: string) => {
    const { client } = this.props;
    clearInterval(this.state.tokenValidityTick);
    this.setState({
      resetTokenErrors: [],
      tokenVerifying: true,
      tokenVerified: false,
      tokenExpiry: undefined,
      tokenValidityTick: undefined
    });

    try {
      const { data } = await client.query<ICheckResetTokenResponse>({
        query: CHECK_RESET_TOKEN,
        variables: { token: rawToken }
      });
      const { isValid, expiry } = data.checkResetToken;
      const resetTokenErrors = [];
      if (!isValid) {
        resetTokenErrors.push("Invalid token.");
      }
      this.resetTokenExpiryDurationTick(expiry);
      this.setState({
        tokenVerified: isValid,
        tokenVerifying: false,
        tokenExpiry: expiry,
        tokenValidityTick: setInterval(this.resetTokenExpiryDurationTick, 1000),
        resetTokenErrors
      });
    } catch (error) {
      const { errors } = parseGraphQLError(error);
      this.setState({
        errors,
        tokenVerified: false,
        tokenVerifying: false,
        tokenExpiry: undefined
      });
    }
  };

  protected resetTokenExpiryDurationTick = (rawExpiry?: number) => {
    const { tokenExpiry: expiry } = this.state;
    const tokenExpiry = rawExpiry ? rawExpiry : expiry;
    if (tokenExpiry) {
      const expiryTime = DateTime.fromMillis(tokenExpiry);
      const diffToNow = expiryTime.diffNow().shiftTo("minutes", "seconds");
      let humanizedDuration = "";
      if (diffToNow.minutes > 0) {
        humanizedDuration += `${diffToNow.minutes} ${
          diffToNow.minutes > 1 ? "minutes " : "minute "
        }`;
      }
      if (diffToNow.seconds > 0) {
        humanizedDuration += `${Math.floor(diffToNow.seconds)} ${
          Math.floor(diffToNow.seconds) > 1 ? "seconds" : "second"
        }`;
      }
      this.setState({
        humanizedDuration
      });
    }
  };

  protected handleChangePassword: FormEventHandler<HTMLInputElement> = e => {
    this.props.dispatch(setFormPassword(e.currentTarget.value));
    this.setState({ passwordErrors: [], passwordValidated: false });
  };

  protected validatePassword = () => {
    const { password } = this.props;
    const { cryptoManager } = this.state;
    if (cryptoManager) {
      const errors = cryptoManager.validateUserInputtedPassword(password);
      if (errors.length > 0) {
        this.setState({
          passwordErrors: errors,
          passwordValidated: false
        });
      } else {
        this.setState({
          passwordErrors: [],
          passwordValidated: true
        });
        return true;
      }
    }
    return false;
  };

  protected handleAcknowledgedLoss = () => {
    this.setState({ acknowledgedLoss: !this.state.acknowledgedLoss });
  };

  protected handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    try {
      event.preventDefault();
      const { client, password, passwordResetToken } = this.props;
      const {
        resetTokenErrors,
        passwordErrors,
        acknowledgedLoss,
        cryptoManager
      } = this.state;

      if (!cryptoManager) {
        throw new Error("Browser does not support WebCrypto!");
      }
      const passwordOK = this.validatePassword();
      if (
        !passwordOK ||
        resetTokenErrors.length > 0 ||
        passwordErrors.length > 0 ||
        !acknowledgedLoss
      ) {
        return;
      }

      // Derive secure master key buffers
      this.setState({
        loading: true,
        loadingText: "Deriving master password...",
        errors: [],
        resetTokenErrors: [],
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
      const mutationResponse = await client.mutate<IResetPasswordResponse>({
        mutation: RESET_PASSWORD_MUTATION,
        variables: {
          resetToken: passwordResetToken,
          newPw: pw,
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
        resetPassword: { jwt, user }
      } = mutationResponse.data as IResetPasswordResponse;

      // Setup the client given the successful response
      this.setState({ loadingText: "Setting up client..." });
      this.props.dispatch(setBase64MK(Buffer.from(mk).toString("base64")));
      this.props.dispatch(setBase64AK(Buffer.from(ak).toString("base64")));
      this.props.dispatch(setAuthData({ user, jwt }));
    } catch (error) {
      const {
        errors,
        resetTokenErrors: tokenErrors,
        passwordErrors
      } = parseGraphQLError(error);
      this.setState({
        errors,
        resetTokenErrors: tokenErrors,
        passwordErrors,
        loading: false
      });
    }
  };
}

const CHECK_RESET_TOKEN = gql`
  query CheckResetToken($token: String!) {
    checkResetToken(resetToken: $token) {
      isValid
      expiry
    }
  }
`;

interface ICheckResetTokenResponse {
  checkResetToken: {
    isValid: boolean;
    expiry: number;
  };
}

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword(
    $resetToken: String!
    $newPw: String!
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
    resetPassword(
      resetToken: $resetToken
      newPw: $newPw
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

interface IResetPasswordResponse {
  resetPassword: {
    jwt: string;
    user: FullUser;
  };
}

const mapStateToProps = (state: IRootState) => {
  return {
    passwordResetToken: state.auth.passwordResetToken,
    password: state.auth.password
  };
};

export default connect(mapStateToProps)(withApollo(ResetPasswordController));
