import React, { Component, FormEventHandler } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import {
  clearAuthData,
  confirmSignOut
} from "../../Modules/Reducers/Auth/Actions";
import { IRootState } from "../../Modules/Reducers/RootReducer";
import Button from "../PureHelpers/Button";
import {
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
    const { confirmSignOutVal, dispatch } = props;
    if (confirmSignOutVal) {
      dispatch(clearAuthData());
    }
  }

  public componentWillReceiveProps(nextProps: IProps) {
    const { confirmSignOutVal, dispatch } = nextProps;
    if (confirmSignOutVal) {
      dispatch(clearAuthData());
    }
  }

  public handleSignOut: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    this.props.dispatch(confirmSignOut());
  };

  public render() {
    return (
      <SignViewContainer>
        <SignViewTitle>Sign Out</SignViewTitle>
        <FormContainer onSubmit={this.handleSignOut}>
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
}

function mapStateToProps(state: IRootState) {
  return {
    confirmSignOutVal: state.auth.confirmSignOut
  };
}

export default connect(mapStateToProps)(SignOutController);