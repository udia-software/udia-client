import React, { ChangeEventHandler, Component, createRef } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import { upsertDraftItem } from "../../Modules/Reducers/DraftItems/Actions";
import { IDraftItemsState } from "../../Modules/Reducers/DraftItems/Reducer";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import { IStructureState } from "../../Modules/Reducers/Structure/Reducer";
import { setSelectedItemId } from "../../Modules/Reducers/Transient/Actions";
import NoteFileEditorView from "./NoteFileEditorView";

interface IProps {
  dispatch: Dispatch;
  editItemId?: string;
  user: FullUser;
  draftItems: IDraftItemsState;
  processedItems: IProcessedItemsState;
  rawItems: IRawItemsState;
  structure: IStructureState;
}

/**
 * Controller should handle new items, editing existing items.
 */
class NoteFileEditorController extends Component<IProps> {
  private contentEditorRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: IProps) {
    super(props);
    this.contentEditorRef = createRef();
  }

  public componentDidMount() {
    if (this.contentEditorRef.current) {
      this.contentEditorRef.current.focus();
    }
  }

  public render() {
    const [draftId, draft] = this.getCurrentDraft();
    if (draft.contentType === "note") {
      const { title, content } = draft.draftContent;
      return (
        <NoteFileEditorView
          key={draftId}
          titleValue={title}
          contentValue={content}
          handleDraftChange={this.handleDraftChange}
          contentEditorRef={this.contentEditorRef}
        />
      );
    }
    return null;
  }

  protected handleDraftChange: ChangeEventHandler<HTMLTextAreaElement> = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const [draftId, draftPayload] = this.getCurrentDraft();
    if (draftPayload.contentType === "note") {
      const draftContent = {
        ...draftPayload.draftContent,
        [e.currentTarget.name]: e.currentTarget.value
      };
      dispatch(setSelectedItemId(draftId));
      dispatch(
        upsertDraftItem(
          draftId,
          "note",
          draftContent,
          draftPayload.parentId,
          draftPayload.uuid,
          draftPayload.errors
        )
      );
    }
  };

  private getCurrentDraft = (): [string, DraftItemPayload] => {
    const {
      editItemId,
      processedItems,
      draftItems,
      structure,
      user
    } = this.props;
    let parentId = user.username;

    // Editing an existing item
    if (editItemId) {
      // Check if a draft already exists, if so return the draft
      for (const draftedAt of Object.keys(draftItems)) {
        const draft = draftItems[draftedAt];
        if (draft && (draft.uuid === editItemId || draftedAt === editItemId)) {
          return [draftedAt, draft];
        }
      }

      const processedItem = processedItems[editItemId];
      // Find the parent of the item (defaults to username)
      for (const dirId of Object.keys(structure)) {
        const itemIds = structure[dirId];
        if (editItemId in itemIds) {
          parentId = dirId;
        }
      }
      if (processedItem && processedItem.contentType === "note") {
        return [
          `${Date.now()}`,
          {
            contentType: processedItem.contentType,
            draftContent: processedItem.processedContent,
            parentId,
            uuid: editItemId
          }
        ];
      }
    }
    // Not editing. Probably creating a new item (or fallback edit item not found)
    return [
      `${Date.now()}`,
      {
        contentType: "note",
        draftContent: {
          title: "",
          content: "",
          noteType: "markdown"
        },
        parentId
      }
    ];
  };
}

const mapStateToProps = (state: IRootState) => {
  const { _persist: _0, ...structure } = state.structure;
  const { _persist: _1, ...processedItems } = state.processedItems;
  const { _persist: _2, ...rawItems } = state.rawItems;
  const { _persist: _3, ...draftItems } = state.draftItems;
  return {
    user: state.auth.authUser!, // WithAuth true
    structure,
    processedItems,
    rawItems,
    draftItems
  };
};

export default connect(mapStateToProps)(NoteFileEditorController);
