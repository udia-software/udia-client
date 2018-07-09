import { DateTime } from "luxon";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { FullUser } from "../../Types";
import {
  FormContainer,
  FormContent,
  FormField,
  FormInput,
  FormTextArea,
  SignViewContainer,
  SignViewTitle
} from "./SignViewShared";

interface IProps {
  dispatch: Dispatch;
  user: FullUser;
}

class ProfileController extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
    document.title = "My Profile - UDIA";
  }

  public render() {
    const { user } = this.props;

    return (
      <SignViewContainer>
        <SignViewTitle>My Profile</SignViewTitle>
        <FormContainer>
          <fieldset>
            <legend>Your profile, {user.username}.</legend>
            <FormContent>
              <FormField>
                <label htmlFor="username">
                  Username:{" "}
                  <FormInput
                    type="text"
                    id="username"
                    value={user.username}
                    disabled={true}
                  />
                </label>
              </FormField>
              <FormField>
                <label htmlFor="createdAt">
                  Created At:{" "}
                  <FormInput
                    type="text"
                    id="createdAt"
                    value={DateTime.fromMillis(user.createdAt).toLocaleString(
                      DateTime.DATETIME_FULL_WITH_SECONDS
                    )}
                    disabled={true}
                  />
                </label>
              </FormField>
              <FormField>
                <label htmlFor="createdAt">
                  Updated At:{" "}
                  <FormInput
                    type="text"
                    id="createdAt"
                    value={DateTime.fromMillis(user.updatedAt).toLocaleString(
                      DateTime.DATETIME_FULL_WITH_SECONDS
                    )}
                    disabled={true}
                  />
                </label>
              </FormField>
              <FormField>
                <label htmlFor="encSecretKey">
                  Encrypted Secret Key:{" "}
                  <FormTextArea
                    id="encSecretKey"
                    value={user.encSecretKey}
                    disabled={true}
                    rows={3}
                  />
                </label>
              </FormField>
              <FormField>
                <label htmlFor="pubVerifyKey">
                  Public Verification Key:{" "}
                  <FormTextArea
                    id="pubVerifyKey"
                    value={user.pubVerifyKey}
                    disabled={true}
                    rows={3}
                  />
                </label>
              </FormField>
              <FormField>
                <label htmlFor="encPrivateSignKey">
                  Encrypted Signing Key:{" "}
                  <FormTextArea
                    id="encPrivateSignKey"
                    value={user.encPrivateSignKey}
                    disabled={true}
                    rows={3}
                  />
                </label>
              </FormField>
              <FormField>
                <label htmlFor="pubEncryptKey">
                  Public Asymmetric Encryption Key:{" "}
                  <FormTextArea
                    id="pubEncryptKey"
                    value={user.pubEncryptKey}
                    disabled={true}
                    rows={3}
                  />
                </label>
              </FormField>
              <FormField>
                <label htmlFor="encPrivateDecryptKey">
                  Encrypted Asymmetric Decryption Key:{" "}
                  <FormTextArea
                    id="encPrivateDecryptKey"
                    value={user.encPrivateDecryptKey}
                    disabled={true}
                    rows={3}
                  />
                </label>
              </FormField>
            </FormContent>
          </fieldset>
        </FormContainer>
      </SignViewContainer>
    );
  }
}

const mapStateToProps = (state: IRootState) => ({
  user: state.auth.authUser! // User is always defined here, thanks to WithAuth wrapper
});

export default connect(mapStateToProps)(ProfileController);
