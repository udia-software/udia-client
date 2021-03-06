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
  public static ProfileComponent = WithAuth(Profile, true, "/sign-in");
  public static UserEmailsComponent = WithAuth(
    UserEmailController,
    true,
    "/sign-in"
  );
  public static UpdatePasswordComponent = WithAuth(
    UpdatePasswordController,
    true,
    "/sign-in"
  );
  public static SignOutComponent = WithAuth(
    SignOutController,
    true,
    "/sign-in"
  );

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
              render={this.renderProfileComponent}
            />
            <Route
              exact={true}
              path="/auth/emails"
              render={this.renderUserEmailsComponent}
            />
            <Route
              exact={true}
              path="/auth/password"
              render={this.renderUpdatePasswordComponent}
            />
            <Route
              exact={true}
              path="/auth/sign-out"
              render={this.renderSignOutComponent}
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

  protected renderProfileComponent = (props: any) => (
    <AuthRoutes.ProfileComponent {...props} />
  );
  protected renderUserEmailsComponent = (props: any) => (
    <AuthRoutes.UserEmailsComponent {...props} />
  );
  protected renderUpdatePasswordComponent = (props: any) => (
    <AuthRoutes.UpdatePasswordComponent {...props} />
  );
  protected renderSignOutComponent = (props: any) => (
    <AuthRoutes.SignOutComponent {...props} />
  );
  protected handleToggleAuthSidebar = () => {
    if (!this.props.showSidebar) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
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
