import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
// import gql from "graphql-tag";
import React, { Component, FormEventHandler } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import { IRootState } from "../../Modules/Reducers/RootReducer";
// import { FullUser } from "../../Types";
import parseGraphQLError from "../PureHelpers/ParseGraphQLError";
import UpdatePasswordView from "./UpdatePasswordView";

interface IProps {
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  password: string;
}

interface IState {
  oldPassword: string;
  loading: boolean;
  loadingText?: string;
  passwordValidated: boolean;
  errors: string[];
  passwordErrors: string[];
  cryptoManager: CryptoManager | null;
  showOldPassword: boolean;
  showNewPassword: boolean;
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
      oldPassword: "",
      loading: false,
      passwordValidated: false,
      errors,
      passwordErrors: [],
      cryptoManager,
      showOldPassword: false,
      showNewPassword: false
    };
  }

  public render() {
    // const { oldPassword } = this.state;
    return <UpdatePasswordView />;
  }

  protected handleUpdatePassword: FormEventHandler<
    HTMLFormElement
  > = async e => {
    try {
      e.preventDefault();
    } catch (err) {
      const { errors, passwordErrors } = parseGraphQLError(err);
      this.setState({
        errors,
        passwordErrors
      });
    }
  };
}

// const UPDATE_PASSWORD_MUTATION = gql`
//   mutation UpdatePasswordMutation(
//     $newPw: String!
//     $pw: String!
//     $pwFunc: String!
//     $pwDigest: String!
//     $pwCost: Int!
//     $pwKeySize: Int!
//     $pwNonce: String!
//     $encPrivateSignKey: String!
//     $encSecretKey: String!
//     $encPrivateDecryptKey: String!
//   ) {
//     updatePassword(
//       newPw: $newPw
//       pw: $pw
//       pwFunc: $pwFunc
//       pwDigest: $pwDigest
//       pwCost: $pwCost
//       pwKeySize: $pwKeySize
//       pwNonce: $pwNonce
//       encPrivateSignKey: $encPrivateSignKey
//       encSecretKey: $encSecretKey
//       encPrivateDecryptKey: $encPrivateDecryptKey
//     ) {
//       uuid
//       username
//       emails {
//         email
//         primary
//         verified
//         createdAt
//         updatedAt
//         verificationExpiry
//       }
//       encSecretKey
//       pubVerifyKey
//       encPrivateSignKey
//       pubEncryptKey
//       encPrivateDecryptKey
//       pwFunc
//       pwDigest
//       pwCost
//       pwKeySize
//       pwNonce
//       createdAt
//       updatedAt
//     }
//   }
// `;

// interface IUpdatePasswordResponse {
//   updatePassword: FullUser;
// }

const mapStateToProps = (state: IRootState) => ({
  newPassword: state.auth.password
});

export default connect(mapStateToProps)(withApollo(UpdatePasswordController));
