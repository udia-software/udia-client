import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/Reducers/RootReducer";
import { toggleAuthSidebar } from "../../Modules/Reducers/Theme/Actions";
import { isShowingAuthSidebar } from "../../Modules/Reducers/Theme/Selectors";
import CreateNoteController from "../Notes/DraftNoteController";
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

const Todo = () => <h1>todo</h1>;

class NoteRoutes extends Component<IProps> {
  public render() {
    const { showSidebar: showSidebarProp } = this.props;
    const showSidebar = showSidebarProp ? "true" : undefined;
    return (
      <WithSidebarContainer>
        <Sidebar showsidebar={showSidebar}>
          <StyledSidebarLink
            showsidebar={showSidebar}
            to="/note/draft"
            activeClassName={activeClassName}
            onClick={this.handleCloseAuthSidebar}
          >
            Draft Note
          </StyledSidebarLink>
          <StyledSidebarLink
            showsidebar={showSidebar}
            to="/note/list"
            activeClassName={activeClassName}
            onClick={this.handleCloseAuthSidebar}
          >
            My Notes
          </StyledSidebarLink>
        </Sidebar>
        <WithSidebarContentContainer>
          <Switch>
            <Redirect exact={true} from="/note" to="/note/list" />
            <Route
              exact={true}
              path="/note/draft"
              component={WithAuth(
                CreateNoteController,
                true,
                "/",
                "/note/draft"
              )}
            />
            <Route
              exact={true}
              path="/note/list"
              component={WithAuth(Todo, true, "/", "/note/list")}
            />
            <Route
              exact={true}
              path="/note/view"
              component={WithAuth(Todo, true, "/", "/note/view")}
            />
            <Route
              exact={true}
              path="/note/edit"
              component={WithAuth(Todo, true, "/", "/note/edit")}
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

export default connect(mapStateToProps)(NoteRoutes);
