import React, { Component, FormEventHandler } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import {
  clearAuthData,
  confirmSignOut
} from "../../Modules/Reducers/Auth/Actions";
import { clearNotesData } from "../../Modules/Reducers/Notes/Actions";
import { IRootState } from "../../Modules/Reducers/RootReducer";
import {
  Button,
  FormContainer,
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
    this.handleSignOut();
  }

  public componentWillReceiveProps(nextProps: IProps) {
    this.handleSignOut();
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
            <legend>Are you leaving?</legend>
            <Button>Yes, farewell.</Button>
          </fieldset>
        </FormContainer>
        <SignViewLinks>
          <Link to="/">← No, I changed my mind.</Link>
        </SignViewLinks>
      </SignViewContainer>
    );
  }

  private handleSignOut = () => {
    const { confirmSignOutVal, dispatch } = this.props;
    if (confirmSignOutVal) {
      dispatch(clearAuthData());
      dispatch(clearNotesData());
    }
  };
}

const mapStateToProps = (state: IRootState) => ({
  confirmSignOutVal: state.auth.confirmSignOut
});

export default connect(mapStateToProps)(SignOutController);
