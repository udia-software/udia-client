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
  setAuthUser,
  setFormPassword
} from "../../Modules/Reducers/Auth/Actions";
import {
  setBase64AK,
  setBase64MK
} from "../../Modules/Reducers/Secrets/Actions";
import parseGraphQLError from "../PureHelpers/ParseGraphQLError";
import UpdatePasswordView from "./UpdatePasswordView";

interface IProps {
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  user: FullUser;
  newPassword: string;
}

interface IState {
  loading: boolean;
  loadingText?: string;
  currentPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  newPasswordValidated: boolean;
  errors: string[];
  success: boolean;
  currentPasswordErrors: string[];
  newPasswordErrors: string[];
  cryptoManager: CryptoManager | null;
}

class UpdatePasswordController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "Update Password - UDIA";
    const errors: string[] = [];
    let cryptoManager: CryptoManager | null = null;
    try {
      cryptoManager = new CryptoManager();
    } catch (err) {
      errors.push(err.message);
    }
    this.state = {
      loading: false,
      currentPassword: "",
      showCurrentPassword: false,
      showNewPassword: false,
      newPasswordValidated: false,
      errors,
      success: false,
      currentPasswordErrors: [],
      newPasswordErrors: [],
      cryptoManager
    };
  }

  public componentDidMount() {
    this.props.dispatch(setFormPassword(""));
  }

  public render() {
    const { newPassword } = this.props;
    const {
      loading,
      loadingText,
      currentPassword,
      showCurrentPassword,
      showNewPassword,
      newPasswordValidated,
      errors,
      success,
      currentPasswordErrors,
      newPasswordErrors
    } = this.state;
    return (
      <UpdatePasswordView
        loading={loading}
        loadingText={loadingText}
        currentPassword={currentPassword}
        newPassword={newPassword}
        showCurrentPassword={showCurrentPassword}
        showNewPassword={showNewPassword}
        newPasswordValidated={newPasswordValidated}
        errors={errors}
        success={success}
        currentPasswordErrors={currentPasswordErrors}
        newPasswordErrors={newPasswordErrors}
        handleToggleCurrentPassword={this.handleToggleCurrentPassword}
        handleToggleNewPassword={this.handleToggleNewPassword}
        handleChangeCurrentPassword={this.handleChangeCurrentPassword}
        handleChangeNewPassword={this.handleChangeNewPassword}
        handleSubmit={this.handleUpdatePassword}
      />
    );
  }

  protected handleToggleCurrentPassword: MouseEventHandler<
    HTMLAnchorElement
  > = e => {
    e.preventDefault();
    this.setState({
      showCurrentPassword: !this.state.showCurrentPassword,
      currentPasswordErrors: [],
      success: false
    });
  };

  protected handleToggleNewPassword: MouseEventHandler<
    HTMLAnchorElement
  > = e => {
    e.preventDefault();
    this.setState({
      showNewPassword: !this.state.showNewPassword,
      newPasswordErrors: [],
      newPasswordValidated: false,
      success: false
    });
  };

  protected handleChangeCurrentPassword: ChangeEventHandler<
    HTMLInputElement
  > = e => {
    if (!this.state.loading) {
      this.setState({
        currentPassword: e.currentTarget.value,
        currentPasswordErrors: [],
        success: false
      });
    }
  };

  protected handleChangeNewPassword: ChangeEventHandler<
    HTMLInputElement
  > = e => {
    if (!this.state.loading) {
      this.props.dispatch(setFormPassword(e.currentTarget.value));
      this.setState({
        newPasswordErrors: [],
        newPasswordValidated: false,
        success: false
      });
    }
  };

  protected handleUpdatePassword: FormEventHandler<
    HTMLFormElement
  > = async e => {
    try {
      e.preventDefault();
      const { client, dispatch, user, newPassword } = this.props;
      const {
        currentPassword,
        cryptoManager,
        currentPasswordErrors,
        newPasswordErrors
      } = this.state;

      // Last quick sanitation
      if (!cryptoManager) {
        throw new Error("Browser does not support WebCrypto!");
      }
      const passwordOK = this.validatePassword();
      if (
        !passwordOK ||
        currentPasswordErrors.length > 0 ||
        newPasswordErrors.length > 0
      ) {
        return;
      }

      // Derive secure login proof of secret for current password
      this.setState({
        loading: true,
        loadingText: "Deriving current master password...",
        showCurrentPassword: false,
        showNewPassword: false,
        errors: [],
        currentPasswordErrors: [],
        newPasswordErrors: [],
        success: false
      });
      const curPwDerivedBufferOutput = await cryptoManager.deriveMasterKeyBuffers(
        {
          userInputtedPassword: currentPassword,
          pwNonce: user.pwNonce,
          pwCost: user.pwCost,
          pwKeySize: user.pwKeySize,
          pwDigest: user.pwDigest,
          pwFunc: user.pwFunc
        }
      );
      const { mk: curMk, ak: curAk } = curPwDerivedBufferOutput;
      const pw = Buffer.from(curPwDerivedBufferOutput.pw).toString("base64");

      // Decrypt existing private signing key
      this.setState({ loadingText: "Decrypting private signing key..." });
      const privateSignKeyBuf = await cryptoManager.decryptWithSecret(
        user.encPrivateSignKey,
        curAk
      );

      // Decrypting existing private secret key
      this.setState({ loadingText: "Decrypting private secret key..." });
      const privateSecretKeyBuf = await cryptoManager.decryptWithSecret(
        user.encSecretKey,
        Buffer.concat([Buffer.from(curMk), Buffer.from(curAk)]).buffer
      );

      // Decrypting existing asymmetric decryption key
      this.setState({
        loadingText: "Decrypting private asymmetric decryption key..."
      });
      const privateDecryptKeyBuf = await cryptoManager.decryptWithSecret(
        user.encPrivateDecryptKey,
        curMk
      );

      // Derive secure master key buffers for new password
      this.setState({ loadingText: "Deriving new master password..." });
      const newPwDerivedBufferOutput = await cryptoManager.deriveMasterKeyBuffers(
        {
          userInputtedPassword: newPassword,
          pwCost: user.pwCost + 1, // Increase derivation cost by 1 every time password changes
          pwKeySize: user.pwKeySize,
          pwDigest: user.pwDigest,
          pwFunc: user.pwFunc
        }
      );
      const { mk: newMk, ak: newAk } = newPwDerivedBufferOutput;
      const newPw = Buffer.from(newPwDerivedBufferOutput.pw).toString("base64");

      // Encrypt private signing key buffer
      this.setState({ loadingText: "Encrypting private signing key..." });
      const encPrivateSignKey = await cryptoManager.encryptWithSecret(
        privateSignKeyBuf,
        newAk
      );

      // Encrypt private secret key
      this.setState({ loadingText: "Encrypting private secret key..." });
      const encSecretKey = await cryptoManager.encryptWithSecret(
        privateSecretKeyBuf,
        Buffer.concat([Buffer.from(newMk), Buffer.from(newAk)]).buffer
      );

      // Encrypt private asymmetrc decryption key
      this.setState({
        loadingText: "Encrypting private asymmetric decryption key..."
      });
      const encPrivateDecryptKey = await cryptoManager.encryptWithSecret(
        privateDecryptKeyBuf,
        newMk
      );

      // Communicate with the server to persist the new password
      this.setState({ loadingText: "Communicating with server..." });
      const mutationResponse = await client.mutate<IUpdatePasswordResponse>({
        mutation: UPDATE_PASSWORD_MUTATION,
        variables: {
          newPw,
          pw,
          pwFunc: newPwDerivedBufferOutput.pwFunc,
          pwDigest: newPwDerivedBufferOutput.pwDigest,
          pwCost: newPwDerivedBufferOutput.pwCost,
          pwKeySize: newPwDerivedBufferOutput.pwKeySize,
          pwNonce: Buffer.from(newPwDerivedBufferOutput.pwNonce).toString(
            "base64"
          ),
          encPrivateSignKey,
          encSecretKey,
          encPrivateDecryptKey
        }
      });
      const {
        updatePassword: updatedUser
      } = mutationResponse.data as IUpdatePasswordResponse;
      dispatch(setBase64MK(Buffer.from(newMk).toString("base64")));
      dispatch(setBase64AK(Buffer.from(newAk).toString("base64")));
      dispatch(setAuthUser(updatedUser));
      dispatch(setFormPassword(""));
      this.setState({
        loading: false,
        loadingText: undefined,
        success: true,
        currentPassword: ""
      });
    } catch (err) {
      const { errors, passwordErrors } = parseGraphQLError(
        err,
        "Failed to update password! (Current password is invalid?)"
      );
      this.setState({
        loading: false,
        loadingText: undefined,
        errors,
        currentPasswordErrors: passwordErrors
      });
    }
  };

  private validatePassword = () => {
    const { newPassword } = this.props;
    const { cryptoManager } = this.state;
    if (cryptoManager) {
      const errors = cryptoManager.validateUserInputtedPassword(newPassword);
      if (errors.length > 0) {
        this.setState({
          newPasswordErrors: errors,
          newPasswordValidated: false
        });
      } else {
        this.setState({
          newPasswordErrors: [],
          newPasswordValidated: true
        });
        return true;
      }
    }
    return false;
  };
}

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePasswordMutation(
    $newPw: String!
    $pw: String!
    $pwFunc: String!
    $pwDigest: String!
    $pwCost: Int!
    $pwKeySize: Int!
    $pwNonce: String!
    $encPrivateSignKey: String!
    $encSecretKey: String!
    $encPrivateDecryptKey: String!
  ) {
    updatePassword(
      newPw: $newPw
      pw: $pw
      pwFunc: $pwFunc
      pwDigest: $pwDigest
      pwCost: $pwCost
      pwKeySize: $pwKeySize
      pwNonce: $pwNonce
      encPrivateSignKey: $encPrivateSignKey
      encSecretKey: $encSecretKey
      encPrivateDecryptKey: $encPrivateDecryptKey
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

interface IUpdatePasswordResponse {
  updatePassword: FullUser;
}

const mapStateToProps = (state: IRootState) => ({
  user: state.auth.authUser!, // User is never null, thanks to WithAuth wrapper
  newPassword: state.auth.password
});

export default connect(mapStateToProps)(withApollo(UpdatePasswordController));
