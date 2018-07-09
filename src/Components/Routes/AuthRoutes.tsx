import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { toggleAuthSidebar } from "../../Modules/Reducers/Theme/Actions";
import { isShowingAuthSidebar } from "../../Modules/Reducers/Theme/Selectors";
import Profile from "../Auth/Profile";
import SignOutController from "../Auth/SignOutController";
import UpdatePasswordController from "../Auth/UpdatePasswordController";
import UserEmailController from "../Auth/UserEmailController";
import NotFound from "../NotFound";
import WithAuth from "../Wrapper/WithAuth";
import {
  activeClassName,
  Sidebar,
  SidebarToggleButton,
  StyledSidebarLink,
  WithSidebarContainer,
  WithSidebarContentContainer
} from "./SidebarShared";

interface IProps {
  dispatch: Dispatch;
  showSidebar: boolean;
}

class AuthRoutes extends Component<IProps> {
  public render() {
    const { showSidebar: showSidebarProp } = this.props;
    const showSidebar = showSidebarProp ? "true" : undefined;
    return (
      <WithSidebarContainer>
        <Sidebar showsidebar={showSidebar}>
          <StyledSidebarLink
            showsidebar={showSidebar}
            to="/auth/profile"
            activeClassName={activeClassName}
            onClick={this.handleCloseAuthSidebar}
          >
            <FontAwesomeIcon icon="user" size="lg" />
            Profile
          </StyledSidebarLink>
          <StyledSidebarLink
            showsidebar={showSidebar}
            to="/auth/emails"
            activeClassName={activeClassName}
            onClick={this.handleCloseAuthSidebar}
          >
            <FontAwesomeIcon icon="envelope" size="lg" />
            Emails
          </StyledSidebarLink>
          <StyledSidebarLink
            showsidebar={showSidebar}
            to="/auth/password"
            activeClassName={activeClassName}
            onClick={this.handleCloseAuthSidebar}
          >
            <FontAwesomeIcon icon="key" size="lg" />
            Update<br />Password
          </StyledSidebarLink>
          <StyledSidebarLink
            showsidebar={showSidebar}
            to="/auth/sign-out"
            activeClassName={activeClassName}
            onClick={this.handleCloseAuthSidebar}
          >
            <FontAwesomeIcon icon="user-slash" size="lg" />
            Sign Out
          </StyledSidebarLink>
        </Sidebar>
        <WithSidebarContentContainer>
          <Switch>
            <Redirect exact={true} from="/auth" to="/auth/profile" />
            <Route
              exact={true}
              path="/auth/profile"
              component={WithAuth(Profile, true, "/", "/auth/profile")}
            />
            <Route
              exact={true}
              path="/auth/emails"
              component={WithAuth(
                UserEmailController,
                true,
                "/",
                "/auth/emails"
              )}
            />
            <Route
              exact={true}
              path="/auth/password"
              component={WithAuth(
                UpdatePasswordController,
                true,
                "/",
                "/auth/password"
              )}
            />
            <Route
              exact={true}
              path="/auth/sign-out"
              component={WithAuth(
                SignOutController,
                true,
                "/",
                "/auth/sign-out"
              )}
            />
            <Route component={NotFound} />
          </Switch>
          <SidebarToggleButton
            showsidebar={showSidebar}
            onClick={this.handleToggleAuthSidebar}
          >
            <FontAwesomeIcon icon="bars" size="2x" />
          </SidebarToggleButton>
        </WithSidebarContentContainer>
      </WithSidebarContainer>
    );
  }

  protected handleToggleAuthSidebar = () => {
    this.props.dispatch(toggleAuthSidebar());
  };

  protected handleCloseAuthSidebar = () => {
    const { showSidebar } = this.props;
    if (showSidebar) {
      this.props.dispatch(toggleAuthSidebar());
    }
  };
}

const mapStateToProps = (state: IRootState) => ({
  showSidebar: isShowingAuthSidebar(state)
});

export default connect(mapStateToProps)(AuthRoutes);
