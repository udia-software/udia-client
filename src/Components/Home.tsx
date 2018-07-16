import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Dispatch } from "redux";
import { IRootState } from "../Modules/ConfigureReduxStore";
import {
  isAuthenticated as selectIsAuth,
  maybeAuthenticated as selectMaybeAuth
} from "../Modules/Reducers/Auth/Selectors";
import { handleAppJustLoaded } from "../Modules/Reducers/Transient/Actions";
import styled from "./AppStyles";

const HomeContainer = styled.div`
  display: grid;
  place-content: center;
  align-items: center;
  justify-items: center;
`;

interface IProps {
  dispatch: Dispatch;
  user: FullUser | null;
  maybeAuthenticated: boolean;
  isAuthenticated: boolean;
  appJustLoaded: boolean;
}

interface IState {
  redirectToNotes: boolean;
}

class Home extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "UDIA";
    this.state = {
      redirectToNotes: false
    };
  }

  public componentDidMount() {
    const { dispatch, appJustLoaded, isAuthenticated } = this.props;
    if (appJustLoaded) {
      if (isAuthenticated) {
        this.setState({ redirectToNotes: true });
      }
      dispatch(handleAppJustLoaded());
    }
  }

  public render() {
    if (this.state.redirectToNotes) {
      return <Redirect to="/note/list" />;
    }
    const { user } = this.props;
    return (
      <HomeContainer>
        <h1>UDIA</h1>
        {user && <p>Welcome, {user.username}.</p>}
      </HomeContainer>
    );
  }
}

const mapStateToProps = (state: IRootState) => ({
  user: state.auth.authUser,
  maybeAuthenticated: selectMaybeAuth(state),
  isAuthenticated: selectIsAuth(state),
  appJustLoaded: state.transient.appJustLoaded
});

export default connect(mapStateToProps)(Home);
