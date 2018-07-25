import React, { Component, FormEventHandler } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import {
  clearAuthData,
  confirmSignOut
} from "../../Modules/Reducers/Auth/Actions";
import { clearDraftItems } from "../../Modules/Reducers/DraftItems/Actions";
import { clearProcessedItems } from "../../Modules/Reducers/ProcessedItems/Actions";
import { clearRawItems } from "../../Modules/Reducers/RawItems/Actions";
import { clearSecretsData } from "../../Modules/Reducers/Secrets/Actions";
import { clearStructure } from "../../Modules/Reducers/Structure/Actions";
import { addAlert } from "../../Modules/Reducers/Transient/Actions";
import { Button } from "../Helpers/Button";
import { ThemedLink } from "../Helpers/ThemedLinkAnchor";
import {
  FormContainer,
  FormLegend,
  SignViewContainer,
  SignViewLinks,
  SignViewTitle
} from "./SignViewShared";

interface IProps {
  dispatch: Dispatch;
  confirmSignOutVal: boolean;
  user: FullUser | null;
}

class SignOutController extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
    document.title = "Sign Out - UDIA";
  }

  public componentDidMount() {
    this.processSignOut();
  }

  public componentDidUpdate() {
    this.processSignOut();
  }

  public handleSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    this.props.dispatch(confirmSignOut());
  };

  public render() {
    return (
      <SignViewContainer>
        <SignViewTitle>Sign Out</SignViewTitle>
        <FormContainer onSubmit={this.handleSubmit}>
          <fieldset>
            <FormLegend>Are you leaving?</FormLegend>
            <Button>Yes, farewell.</Button>
          </fieldset>
        </FormContainer>
        <SignViewLinks>
          <ThemedLink to="/">← No, I changed my mind.</ThemedLink>
        </SignViewLinks>
      </SignViewContainer>
    );
  }

  private processSignOut = () => {
    const { dispatch, user, confirmSignOutVal } = this.props;
    if (confirmSignOutVal) {
      if (user) {
        dispatch(
          addAlert({
            type: "info",
            timestamp: Date.now(),
            content: `Goodbye, ${user.username}.`
          })
        );
      }
      dispatch(clearSecretsData());
      dispatch(clearAuthData());
      dispatch(clearProcessedItems());
      dispatch(clearRawItems());
      dispatch(clearDraftItems());
      dispatch(clearStructure());
    }
  };
}

const mapStateToProps = (state: IRootState) => ({
  user: state.auth.authUser,
  confirmSignOutVal: state.auth.confirmSignOut
});

export default connect(mapStateToProps)(SignOutController);
