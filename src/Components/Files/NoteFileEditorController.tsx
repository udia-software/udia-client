import React, {
  ChangeEventHandler,
  Component,
  createRef,
  FocusEventHandler,
  MouseEventHandler
} from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import {
  clearDraftItem,
  upsertDraftItem
} from "../../Modules/Reducers/DraftItems/Actions";
import { IDraftItemsState } from "../../Modules/Reducers/DraftItems/Reducer";
import { upsertProcessedItem } from "../../Modules/Reducers/ProcessedItems/Actions";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { upsertRawItem } from "../../Modules/Reducers/RawItems/Actions";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import { ISecretsState } from "../../Modules/Reducers/Secrets/Reducer";
import { setStructure } from "../../Modules/Reducers/Structure/Actions";
import { IStructureState } from "../../Modules/Reducers/Structure/Reducer";
import {
  addAlert,
  setSelectedItemId
} from "../../Modules/Reducers/Transient/Actions";
import parseGraphQLError from "../Helpers/ParseGraphQLError";
import {
  CREATE_ITEM_MUTATION,
  DELETE_ITEM_MUTATION,
  ICreateItemMutationResponse,
  IDeleteItemResponseData,
  IUpdateItemMutationResponse,
  UPDATE_ITEM_MUTATION
} from "./ItemFileShared";
import NoteFileEditorView from "./NoteFileEditorView";

interface IProps {
  dispatch: Dispatch;
  editItemId?: string;
  user: FullUser;
  secrets: ISecretsState;
  draftItems: IDraftItemsState;
  processedItems: IProcessedItemsState;
  rawItems: IRawItemsState;
  structure: IStructureState;
}

interface IState {
  isPreview: boolean;
  loading: boolean;
  loadingText?: string;
  focusOn?: string;
}

/**
 * Controller should handle new items, editing existing items.
 */
class NoteFileEditorController extends Component<
  WithApolloClient<IProps>,
  IState
> {
  private titleTextareaRef: React.RefObject<HTMLTextAreaElement>;
  private contentTextareaRef: React.RefObject<HTMLTextAreaElement>;

  constructor(props: WithApolloClient<IProps>) {
    super(props);
    this.titleTextareaRef = createRef();
    this.contentTextareaRef = createRef();
    this.state = {
      isPreview: false,
      loading: false
    };
  }

  public componentDidMount() {
    this.processEditorFocus();
  }

  public componentDidUpdate() {
    this.processEditorFocus();
  }

  public render() {
    const [draftId, draft] = this.getCurrentDraft();
    const { draftItems } = this.props;
    const { loading, loadingText, isPreview } = this.state;

    if (draft.contentType === "note") {
      const { title, content } = draft.draftContent;
      return (
        <NoteFileEditorView
          key={draftId}
          loading={loading}
          loadingText={loadingText}
          hasDraft={draftId in draftItems}
          isPreview={isPreview}
          isRaw={!!draft.uuid}
          titleValue={title}
          contentValue={content}
          handleTogglePreview={this.handleTogglePreview}
          handleDraftFocus={this.handleDraftFocus}
          handleDraftChange={this.handleDraftChange}
          handleDiscardDraft={this.handleDiscardDraft}
          handleSaveDraft={this.handleSaveDraftNote}
          handleDeleteNote={this.handleDeleteNote}
          titleRef={this.titleTextareaRef}
          contentRef={this.contentTextareaRef}
        />
      );
    }
    return null;
  }

  protected handleDraftFocus: FocusEventHandler<HTMLTextAreaElement> = e => {
    e.preventDefault();
    const { focusOn } = this.state;
    if (focusOn !== e.currentTarget.name) {
      this.setState({ focusOn: e.currentTarget.name });
    }
    return true;
  };

  protected handleTogglePreview: MouseEventHandler<HTMLElement> = e => {
    e.preventDefault();
    this.setState({ isPreview: !this.state.isPreview });
  };

  protected handleDiscardDraft: MouseEventHandler<HTMLElement> = e => {
    e.preventDefault();
    const [draftId, draftPayload] = this.getCurrentDraft();
    const { structure, dispatch } = this.props;
    dispatch(clearDraftItem(draftId));
    dispatch(
      addAlert({
        type: "info",
        timestamp: Date.now(),
        content: `Discarded draft '${(draftPayload.contentType === "note" &&
          draftPayload.draftContent.title) ||
          "Untitled"}'`
      })
    );
    const newStructure = [...structure[draftPayload.parentId]];
    const structureIdx = newStructure.indexOf(draftId);
    if (structureIdx >= 0) {
      newStructure.splice(structureIdx, 1);
      dispatch(setStructure(draftPayload.parentId, newStructure));
    }
    if (draftPayload.uuid) {
      dispatch(setSelectedItemId(draftPayload.uuid));
    } else {
      dispatch(setSelectedItemId(newStructure[0]));
    }
  };

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

  protected handleSaveDraftNote: MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    try {
      const {
        dispatch,
        client,
        user,
        secrets: { akB64, mkB64 },
        structure
      } = this.props;
      if (!akB64 || !mkB64) {
        throw new Error("Encryption secrets not set! Please re-authenticate.");
      }
      const [draftId, currentDraft] = this.getCurrentDraft();
      if (currentDraft.contentType !== "note") {
        throw new Error(
          `Cannot submit note item of type ${currentDraft.contentType}!`
        );
      }
      if (!currentDraft.draftContent.content) {
        throw new Error("Content cannot be empty!");
      }
      const cryptoManager = new CryptoManager();
      this.setState({ loading: true });
      const {
        encNoteContent,
        encItemKey
      } = await cryptoManager.encryptNoteToItem(
        currentDraft.draftContent,
        user.encPrivateSignKey,
        user.encSecretKey,
        akB64,
        mkB64,
        (loadingText: string) => this.setState({ loadingText })
      );
      this.setState({ loadingText: "Communicating with server..." });
      const mutation = !!currentDraft.uuid
        ? UPDATE_ITEM_MUTATION
        : CREATE_ITEM_MUTATION;
      const variables: any = {
        id: currentDraft.uuid,
        params: {
          content: encNoteContent,
          contentType: currentDraft.contentType,
          encItemKey,
          parentId:
            currentDraft.parentId === user.username
              ? undefined
              : currentDraft.parentId
        }
      };
      const mutationResponse = await client.mutate<
        ICreateItemMutationResponse | IUpdateItemMutationResponse
      >({ mutation, variables });
      let item: Item;
      if (!!currentDraft.uuid) {
        const {
          updateItem
        } = mutationResponse.data as IUpdateItemMutationResponse;
        item = updateItem;
      } else {
        const {
          createItem
        } = mutationResponse.data as ICreateItemMutationResponse;
        item = createItem;
      }
      dispatch(upsertRawItem(item));
      dispatch(
        upsertProcessedItem(
          item.uuid,
          Date.now(),
          "note",
          currentDraft.draftContent
        )
      );
      let updatedStructure = [...structure[currentDraft.parentId]];
      const itemIdx = updatedStructure.indexOf(item.uuid);
      if (itemIdx < 0) {
        updatedStructure = [item.uuid, ...updatedStructure];
      }
      const draftIdx = updatedStructure.indexOf(draftId);
      if (draftIdx >= 0) {
        updatedStructure.splice(draftIdx, 1);
      }
      dispatch(setStructure(currentDraft.parentId, updatedStructure));
      dispatch(clearDraftItem(draftId));
      this.setState({
        loading: false,
        loadingText: undefined
      });
      dispatch(
        addAlert({
          type: "success",
          timestamp: item.updatedAt,
          content: `${
            currentDraft.uuid ? "Updated" : "Created"
          } note '${currentDraft.draftContent.title || "Untitled"}'`
        })
      );
      dispatch(setSelectedItemId(item.uuid));
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed saving note!");
      this.setState({ loading: false, loadingText: undefined });
      this.props.dispatch(
        addAlert({
          type: "error",
          timestamp: Date.now(),
          content: errors[0] || "Failed saving note!"
        })
      );
    }
  };

  protected handleDeleteNote = async () => {
    try {
      const { client, user, editItemId, structure, dispatch } = this.props;
      if (!editItemId) {
        throw new Error("Cannot delete unidentified item!");
      }
      this.setState({
        loading: true,
        loadingText: "Deleting note from the server..."
      });
      const response = await client.mutate({
        mutation: DELETE_ITEM_MUTATION,
        variables: { id: editItemId }
      });
      const { deleteItem } = response.data as IDeleteItemResponseData;
      const dirId =
        (deleteItem.parent && deleteItem.parent.uuid) || user.username;
      this.setState({
        loading: false,
        loadingText: undefined
      });
      const updatedStructure = [...structure[dirId]];
      const delIdx = updatedStructure.indexOf(deleteItem.uuid);
      if (delIdx >= 0) {
        updatedStructure.splice(delIdx, 1);
      }
      dispatch(
        addAlert({
          type: "success",
          timestamp: deleteItem.updatedAt,
          content: "Successfully deleted item."
        })
      );
      dispatch(setStructure(dirId, updatedStructure));
      dispatch(upsertRawItem(deleteItem));
      dispatch(
        upsertProcessedItem(deleteItem.uuid, deleteItem.updatedAt, null, null)
      );
      dispatch(setSelectedItemId(updatedStructure[0]));
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed deleting note!");
      this.setState({ loading: false, loadingText: undefined });
      this.props.dispatch(
        addAlert({
          type: "error",
          timestamp: Date.now(),
          content: errors[0] || "Failed deleting note!"
        })
      );
    }
  };

  private processEditorFocus = () => {
    const { focusOn } = this.state;
    // const curFocusOn = document.activeElement.getAttribute("name");
    if (this.contentTextareaRef.current && focusOn !== "title") {
      this.contentTextareaRef.current.focus();
    }
    if (this.titleTextareaRef.current && focusOn === "title") {
      this.titleTextareaRef.current.focus();
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
    secrets: state.secrets,
    draftItems,
    processedItems,
    rawItems,
    structure
  };
};

export default connect(mapStateToProps)(withApollo(NoteFileEditorController));
