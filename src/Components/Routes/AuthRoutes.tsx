import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/Reducers/RootReducer";
import { toggleAuthSidebar } from "../../Modules/Reducers/Theme/Actions";
import { isShowingAuthSidebar } from "../../Modules/Reducers/Theme/Selectors";
import styled from "../AppStyles";
import Profile from "../Auth/Profile";
import SignOutController from "../Auth/SignOutController";
import { Button } from "../Auth/SignViewShared";
import UserEmailController from "../Auth/UserEmailController";
import NotFound from "../NotFound";
import WithAuth from "../Wrapper/WithAuth";

interface IProps {
  dispatch: Dispatch;
  showSidebar: boolean;
}

const AuthContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-rows: auto;
  grid-template-areas: "auth-content";
`;

const AuthBodyContainer = styled.div`
  grid-area: auth-content;
  grid-auto-rows: 1fr auto;
  grid-auto-flow: row;
  display: grid;
  width: 100%;
  height: 100%;
`;

const AuthSidebar = styled.div.attrs<{ showsidebar?: string }>({})`
  display: grid;
  grid-area: auth-content;
  justify-self: end;
  grid-row-gap: 1em;
  grid-auto-rows: 3em;
  grid-auto-flow: row;
  align-items: start;
  justify-items: center;
  background-color: ${({ theme }) => theme.panelBackgroundColor};
  transition: all 0.2s;
  @media only screen and (max-width: ${({ theme }) =>
      theme.smScrnBrkPx - 1}px) {
    ${({ showsidebar }) =>
      showsidebar
        ? `overflow: visible; width: auto;`
        : `overflow: hidden; width: 0px;`};
  }
  @media only screen and (min-width: ${({ theme }) => theme.smScrnBrkPx}px) {
    width: 8em;
  }
  z-index: 1;
`;

const activeClassName = "sidebar-nav-active";
const StyledAuthSidebarLink = styled(NavLink).attrs<{
  showsidebar?: string;
  activeClassName: string;
}>({ activeClassName })`
  margin-top: 1em;
  font-size: large;
  display: grid;
  grid-auto-flow: row;
  place-items: center;
  align-content: space-evenly;
  justify-content: center;
  place-self: center;
  border-top: 1px solid ${({ theme }) => theme.inverseColor};
  border-bottom: 1px solid ${({ theme }) => theme.inverseColor};
  transition-property: all 0.2s;
  &:hover {
    border-top: 1px solid ${({ theme }) => theme.primaryColor};
    border-bottom: 1px solid ${({ theme }) => theme.primaryColor};
  }
  @media only screen and (max-width: ${({ theme }) =>
      theme.smScrnBrkPx - 1}px) {
    ${({ showsidebar }) =>
      showsidebar ? `width: 8em;` : `overflow: hidden; width: 0px;`};
  }
  &.${activeClassName} {
    color: ${({ theme }) => theme.primaryColor};
    border-top: 1px solid ${({ theme }) => theme.primaryColor};
    border-bottom: 1px solid ${({ theme }) => theme.primaryColor};
  }
`;

const SidebarToggleButton = Button.extend.attrs<{ showsidebar?: string }>({})`
  &:active {
    opacity: 0;  
  }
  ${props => (props.showsidebar ? "transform: rotate(90deg);" : undefined)}
  @media only screen and (
    max-width: ${({ theme: { smScrnBrkPx } }) => smScrnBrkPx - 1}px
  ) {
    justify-self: end;
    position: sticky;
    bottom: 1em;
    opacity: 100;
    height: 4em;
    width: 4em;
    border-radius: 50%;
    padding: 0;
    margin: 1em;
  }
  @media only screen and (min-width: ${props => props.theme.smScrnBrkPx}px) {
    display: none;
  }
  z-index: 1;
`;

class AuthRoutes extends Component<IProps> {
  public render() {
    const { showSidebar: showSidebarProp } = this.props;
    const showSidebar = showSidebarProp ? "true" : undefined;
    return (
      <AuthContainer>
        <AuthSidebar showsidebar={showSidebar}>
          <StyledAuthSidebarLink
            showsidebar={showSidebar}
            to="/auth/profile"
            activeClassName={activeClassName}
            onClick={this.handleCloseAuthSidebar}
          >
            <FontAwesomeIcon icon="user" size="lg" />
            Profile
          </StyledAuthSidebarLink>
          <StyledAuthSidebarLink
            showsidebar={showSidebar}
            to="/auth/emails"
            activeClassName={activeClassName}
            onClick={this.handleCloseAuthSidebar}
          >
            <FontAwesomeIcon icon="envelope" size="lg" />
            Emails
          </StyledAuthSidebarLink>

          <StyledAuthSidebarLink
            showsidebar={showSidebar}
            to="/auth/sign-out"
            activeClassName={activeClassName}
            onClick={this.handleCloseAuthSidebar}
          >
            <FontAwesomeIcon icon="user-slash" size="lg" />
            Sign Out
          </StyledAuthSidebarLink>
        </AuthSidebar>
        <AuthBodyContainer>
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
              component={WithAuth(UserEmailController, true, "/", "/auth/emails")}
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
        </AuthBodyContainer>
      </AuthContainer>
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
