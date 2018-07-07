import React, { ChangeEventHandler, Component, MouseEventHandler } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  setDraftNoteContent,
  setDraftNoteTitle
} from "../../Modules/Reducers/Notes/Actions";
import { IDraftNote } from "../../Modules/Reducers/Notes/Reducer";
import { IRootState } from "../../Modules/Reducers/RootReducer";
import DraftNoteView from "./DraftNoteView";

interface IProps {
  dispatch: Dispatch;
  draftNote: IDraftNote;
}

interface IState {
  preview: boolean;
  loading: boolean;
  loadingText?: string;
}

const parentId = "n";

class CreateNoteController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      preview: false,
      loading: false
    };
  }

  public render() {
    const { draftNote } = this.props;
    const { preview } = this.state;
    return (
      <DraftNoteView
        preview={preview}
        draftNote={
          draftNote || { content: "", title: "", noteType: "markdown" }
        }
        handleTogglePreview={this.handleTogglePreview}
        handleChangeNoteTitle={this.handleChangeNoteTitle}
        handleChangeNoteContent={this.handleChangeNoteContent}
      />
    );
  }

  protected handleChangeNoteTitle: ChangeEventHandler<HTMLInputElement> = e => {
    this.props.dispatch(setDraftNoteTitle(parentId, e.currentTarget.value));
  };

  protected handleChangeNoteContent: ChangeEventHandler<
    HTMLTextAreaElement
  > = e => {
    this.props.dispatch(setDraftNoteContent(parentId, e.currentTarget.value));
  };

  protected handleTogglePreview: MouseEventHandler<HTMLButtonElement> = e => {
    this.setState({
      preview: !this.state.preview
    });
  };
}

const mapStateToProps = (state: IRootState) => ({
  draftNote: state.notes.drafts[parentId]
});

export default connect(mapStateToProps)(CreateNoteController);
