import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { connect, Dispatch } from "react-redux";
import { NavLink, Route, Switch } from "react-router-dom";
import { IRootState } from "../../Modules/Reducers/RootReducer";
import { toggleAuthSidebar } from "../../Modules/Reducers/Theme/Actions";
import { isShowingAuthSidebar } from "../../Modules/Reducers/Theme/Selectors";
import styled from "../AppStyles";
import SignOutController from "../Auth/SignOutController";
import NotFound from "../NotFound";
import { StyleComponent as Button } from "../PureHelpers/Button";
import WithAuth from "../Wrapper/WithAuth";

export interface IProps {
  dispatch: Dispatch;
  showSidebar: boolean;
}

const AuthContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas: "auth-content auth-sidebar";
`;

const AuthBodyContainer = styled.div`
  grid-area: auth-content;
  display: grid;
  width: 100%;
  height: 100%;
`;

const AuthSidebar = styled.div.attrs<{ showsidebar?: string }>({})`
  display: grid;
  grid-area: auth-sidebar;
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
      showsidebar ? `overflow: visible; width: 8em;` : `display: none`};
  }
  &.${activeClassName} {
    color: ${({ theme }) => theme.primaryColor};
  }
`;

const SidebarToggleButton = Button.extend.attrs<{ showsidebar?: string }>({})`
  &:active {
    opacity: 0;  
  }
  ${props => (props.showsidebar ? "transform: rotate(90deg);" : undefined)}
  @media only screen and (max-width: ${({ theme }) =>
    theme.smScrnBrkPx - 1}px) {
    grid-area: ${({ showsidebar }) =>
      showsidebar ? `auth-sidebar;` : `auth-content;`}
    opacity: 100;
    place-self: end;
    height: 4em;
    width: 4em;
    border-radius: 50%;
    padding: 0;
    margin: 1em;
  }
  @media only screen and (min-width: ${props => props.theme.smScrnBrkPx}px) {
    display: none;
  }
`;

class AuthRoutes extends Component<IProps> {
  public handleToggleAuthSidebar = () => {
    this.props.dispatch(toggleAuthSidebar());
  };

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
          >
            <FontAwesomeIcon icon="user" size="lg" />
            Profile
          </StyledAuthSidebarLink>
          <StyledAuthSidebarLink
            showsidebar={showSidebar}
            to="/auth/sign-out"
            activeClassName={activeClassName}
          >
            <FontAwesomeIcon icon="user-slash" size="lg" />
            Sign Out
          </StyledAuthSidebarLink>
        </AuthSidebar>
        <AuthBodyContainer>
          <Switch>
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
        </AuthBodyContainer>
        <SidebarToggleButton
          showsidebar={showSidebar}
          onClick={this.handleToggleAuthSidebar}
        >
          <FontAwesomeIcon icon="bars" size="2x" />
        </SidebarToggleButton>
      </AuthContainer>
    );
  }
}

const mapStateToProps = (state: IRootState) => ({
  showSidebar: isShowingAuthSidebar(state)
});

export default connect(mapStateToProps)(AuthRoutes);