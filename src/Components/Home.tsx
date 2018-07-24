import React, { Component } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../Modules/ConfigureReduxStore";
import styled from "./AppStyles";
import { ThemedLink } from "./Helpers/ThemedLinkAnchor";

const HomeContainer = styled.div`
  display: grid;
  place-content: center;
  align-items: center;
  justify-items: center;
`;

interface IProps {
  dispatch: Dispatch;
  user: FullUser | null;
}

class Home extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
    document.title = "UDIA";
  }

  public render() {
    const { user } = this.props;
    return (
      <HomeContainer>
        <h1>UDIA</h1>
        {user && <p>Welcome, {user.username}.</p>}
        <h3 style={{ padding: 0, margin: "0 0 1em 0" }}>
          This iteration of UDIA is:
        </h3>
        <div style={{ maxWidth: "18em", textAlign: "justify" }}>
          an <strong>end to end encrypted</strong> file browser supporting
          <ul>
            <li>plain text</li>
            <li>markdown</li>
          </ul>
          and a materialization of the universal API.
        </div>
        <p style={{ textAlign: "center", maxWidth: "18em" }}>
          <ThemedLink to="/health">
            Ensure your browser supports the cryptographic algorithms.
          </ThemedLink>
          <br />
          We are all agents of the universal dream.
        </p>
      </HomeContainer>
    );
  }
}

const mapStateToProps = (state: IRootState) => ({
  user: state.auth.authUser
});

export default connect(mapStateToProps)(Home);
