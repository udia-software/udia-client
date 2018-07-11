import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { toggleAuthSidebar } from "../../Modules/Reducers/Theme/Actions";
import { isShowingAuthSidebar } from "../../Modules/Reducers/Theme/Selectors";
import CreateNoteController from "../Notes/DraftNoteController";
import ListNotesController from "../Notes/ListNotesController";
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
  public static DraftNoteComponent = WithAuth(
    CreateNoteController,
    true,
    "/",
    "/note/draft"
  );
  public static ListNotesComponent = WithAuth(
    ListNotesController,
    true,
    "/",
    "/note/list"
  );
  public static ViewNoteComponent = WithAuth(Todo, true, "/", "/note/view");
  public static EditNoteComponent = WithAuth(Todo, true, "/", "/note/edit");

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
              render={this.renderDraftNoteComponent}
            />
            <Route
              exact={true}
              path="/note/list"
              render={this.renderListNotesComponent}
            />
            <Route
              exact={true}
              path="/note/view"
              render={this.renderViewNoteComponent}
            />
            <Route
              exact={true}
              path="/note/edit"
              render={this.renderEditNoteComponent}
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

  protected renderDraftNoteComponent = (props: any) => (
    <NoteRoutes.DraftNoteComponent {...props} />
  );
  protected renderListNotesComponent = (props: any) => (
    <NoteRoutes.ListNotesComponent {...props} />
  );
  protected renderViewNoteComponent = (props: any) => (
    <NoteRoutes.ViewNoteComponent {...props} />
  );
  protected renderEditNoteComponent = (props: any) => (
    <NoteRoutes.EditNoteComponent {...props} />
  );

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

const mapStateToProps = (state: IRootState) => {
  return {
    showSidebar: isShowingAuthSidebar(state)
  };
};

export default connect(mapStateToProps)(NoteRoutes);
