import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import {
  addAlert,
  handleAppJustLoaded
} from "../../Modules/Reducers/Transient/Actions";
import { StatusType } from "../../Modules/Reducers/Transient/Reducer";
import styled from "../AppStyles";
import SimpleLoader from "../Helpers/SimpleLoader";

const StatusContainer = styled.div`
  grid-area: content;
  position: sticky;
  margin-top: auto;
  margin-right: auto;
  width: auto;
  left: 0;
  bottom: 0;
  border: 1px solid ${props => props.theme.primaryColor};
  border-radius: 3px;
`;

interface IBaseProps {
  dispatch: Dispatch;
  user: FullUser | null;
  appJustLoaded: boolean;
  status?: { type: StatusType; content: string };
}

type IProps = RouteComponentProps<IBaseProps> & IBaseProps;

class Status extends Component<IProps> {
  public componentWillMount() {
    const { dispatch, user, appJustLoaded, location } = this.props;
    if (appJustLoaded) {
      if (user) {
        const emailVerified = user.emails.reduce(
          (acc, cur) => acc || cur.verified,
          false
        );
        if (!emailVerified && !location.pathname.startsWith("/verify-email")) {
          dispatch(
            addAlert({
              type: "error",
              timestamp: Date.now(),
              content: `Please verify your email!`
            })
          );
        }
      }
      this.props.dispatch(handleAppJustLoaded());
    }
  }

  public render() {
    const { status, user, appJustLoaded, location } = this.props;
    if (user && appJustLoaded && location.pathname === "/") {
      return <Redirect to="/file" />;
    }
    return status ? (
      <StatusContainer>
        <SimpleLoader loading={status.type === "loading"} />
        {status.content}
      </StatusContainer>
    ) : null;
  }
}
const mapStateToProps = (state: IRootState) => ({
  status: state.transient.status,
  appJustLoaded: state.transient.appJustLoaded,
  user: state.auth.authUser
});

export default withRouter(connect(mapStateToProps)(Status));
