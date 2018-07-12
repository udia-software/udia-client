import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { IRootState } from "../Modules/ConfigureReduxStore";
import {
  isAuthenticated as selectIsAuth,
  maybeAuthenticated as selectMaybeAuth
} from "../Modules/Reducers/Auth/Selectors";
import styled from "./AppStyles";

const HomeContainer = styled.div`
  display: grid;
  place-content: center;
  place-items: center;
`;

interface IProps {
  user: FullUser | null;
  maybeAuthenticated: boolean;
  isAuthenticated: boolean;
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

  public render() {
    if (this.state.redirectToNotes) {
      return <Redirect to="/notes/list" />;
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
  isAuthenticated: selectIsAuth(state)
});

export default connect(mapStateToProps)(Home);
