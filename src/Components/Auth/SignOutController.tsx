import React, { Component, FormEventHandler } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import {
  clearAuthData,
  confirmSignOut
} from "../../Modules/Reducers/Auth/Actions";
import { clearNotesData } from "../../Modules/Reducers/Notes/Actions";
import { clearProcessedItems } from "../../Modules/Reducers/ProcessedItems/Actions";
import { clearRawItems } from "../../Modules/Reducers/RawItems/Actions";
import { clearSecretsData } from "../../Modules/Reducers/Secrets/Actions";
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
}

class SignOutController extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
    document.title = "Sign Out - UDIA";
    const { confirmSignOutVal, dispatch } = props;
    this.handleSignOut({ confirmSignOutVal, dispatch });
  }

  public componentWillReceiveProps(nextProps: IProps) {
    const { confirmSignOutVal, dispatch } = nextProps;
    this.handleSignOut({ confirmSignOutVal, dispatch });
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

  private handleSignOut = ({
    confirmSignOutVal,
    dispatch
  }: {
    confirmSignOutVal: boolean;
    dispatch: Dispatch;
  }) => {
    if (confirmSignOutVal) {
      dispatch(clearSecretsData());
      dispatch(clearAuthData());
      dispatch(clearNotesData());
      dispatch(clearProcessedItems());
      dispatch(clearRawItems());
    }
  };
}

const mapStateToProps = (state: IRootState) => ({
  confirmSignOutVal: state.auth.confirmSignOut
});

export default connect(mapStateToProps)(SignOutController);
