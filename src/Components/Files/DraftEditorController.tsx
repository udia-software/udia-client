import React, {
  ChangeEventHandler,
  Component,
  createRef,
  FocusEventHandler,
  MouseEventHandler,
  RefObject
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
import DirectoryItemEditorView from "./DirectoryItemEditorView";
import {
  CREATE_ITEM_MUTATION,
  DELETE_ITEM_MUTATION,
  findOrInitDraft,
  ICreateItemMutationResponse,
  IDeleteItemResponseData,
  IUpdateItemMutationResponse,
  UPDATE_ITEM_MUTATION
} from "./ItemFileShared";
import NoteItemEditorView from "./NoteItemEditorView";

interface IProps {
  dispatch: Dispatch;
  itemOrDraftId?: string;
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
class DraftEditorController extends Component<
  WithApolloClient<IProps>,
  IState
> {
  private titleTextareaRef: RefObject<HTMLTextAreaElement>;
  private contentTextareaRef: RefObject<HTMLTextAreaElement>;
  private dirNameTextareaRef: RefObject<HTMLTextAreaElement>;

  constructor(props: WithApolloClient<IProps>) {
    super(props);
    this.titleTextareaRef = createRef();
    this.contentTextareaRef = createRef();
    this.dirNameTextareaRef = createRef();
    this.state = {
      isPreview: false,
      loading: false
    };
  }

  public componentDidMount() {
    this.processEditorFocus();
    this.processTitleScrollHeight();
    this.processResetPreview();
  }

  public componentDidUpdate() {
    this.processEditorFocus();
    this.processTitleScrollHeight();
    this.processResetPreview();
  }

  public render() {
    const {
      user,
      itemOrDraftId,
      draftItems,
      rawItems,
      processedItems,
      structure
    } = this.props;
    const { loading, loadingText, isPreview } = this.state;
    const { draftId, draft } = findOrInitDraft(
      user,
      itemOrDraftId,
      processedItems,
      draftItems,
      structure
    );
    if (draft.contentType === "note") {
      const rawItem = draft.uuid ? rawItems[draft.uuid] : undefined;
      const processedItem = draft.uuid
        ? (processedItems[draft.uuid] as ProcessedNotePayload)
        : undefined;
      const { title, content, noteType } = draft.draftContent;
      const protocolVersion =
        rawItem && rawItem.content ? rawItem.content.split(":")[0] : undefined;

      return (
        <NoteItemEditorView
          loading={loading}
          loadingText={loadingText}
          hasDraft={draftId in draftItems}
          isPreview={isPreview}
          isEditing={!!draft.uuid}
          noteType={noteType}
          titleValue={title}
          contentValue={content}
          protocolVersion={protocolVersion}
          rawNoteItem={rawItem}
          processedNoteItem={processedItem}
          handleTogglePreview={this.handleTogglePreview}
          handleDraftFocus={this.handleDraftFocus}
          handleDraftChange={this.handleDraftChange}
          handleDiscardDraft={this.handleDiscardDraft}
          handleSaveDraft={this.handleSaveDraft}
          handleDeleteNote={this.handleDeleteNote}
          titleRef={this.titleTextareaRef}
          contentRef={this.contentTextareaRef}
        />
      );
    } else if (draft.contentType === "directory") {
      return (
        <DirectoryItemEditorView
          loading={false}
          titleValue={draft.draftContent.dirName}
          handleDraftChange={this.handleDraftChange}
          handleDraftFocus={this.handleDraftFocus}
          handleSaveDraft={this.handleSaveDraft}
          dirNameRef={this.dirNameTextareaRef}
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
    window.scrollTo(0, 0);
    this.setState({ isPreview: !this.state.isPreview });
  };

  protected handleDiscardDraft: MouseEventHandler<HTMLElement> = e => {
    e.preventDefault();
    const {
      structure,
      dispatch,
      user,
      itemOrDraftId,
      processedItems,
      draftItems
    } = this.props;
    const { draftId, draft: draftPayload } = findOrInitDraft(
      user,
      itemOrDraftId,
      processedItems,
      draftItems,
      structure
    );
    dispatch(clearDraftItem(draftId));
    dispatch(
      addAlert({
        type: "info",
        timestamp: Date.now(),
        content: `Discarded draft '${(draftPayload.contentType === "note" &&
          draftPayload.draftContent.title) ||
          "Untitled"}'.`
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
    const {
      dispatch,
      user,
      itemOrDraftId,
      processedItems,
      draftItems,
      structure
    } = this.props;
    const { draftId, draft } = findOrInitDraft(
      user,
      itemOrDraftId,
      processedItems,
      draftItems,
      structure
    );
    const draftContent: DecryptedNote | DecryptedDirectory = {
      ...draft.draftContent,
      [e.currentTarget.name]: e.currentTarget.value
    };
    dispatch(
      upsertDraftItem(
        draftId,
        draft.contentType,
        draftContent,
        draft.parentId,
        draft.uuid,
        draft.errors
      )
    );
  };

  protected handleSaveDraft: MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    try {
      const {
        dispatch,
        client,
        itemOrDraftId,
        processedItems,
        draftItems,
        user,
        secrets: { akB64, mkB64 },
        structure
      } = this.props;
      if (!akB64 || !mkB64) {
        throw new Error("Encryption secrets not set! Please re-authenticate.");
      }
      const { draftId, draft } = findOrInitDraft(
        user,
        itemOrDraftId,
        processedItems,
        draftItems,
        structure
      );
      const cryptoManager = new CryptoManager();
      this.setState({ loading: true });
      const { encNoteContent, encItemKey } = await cryptoManager.encryptToItem(
        draft.draftContent,
        user.encPrivateSignKey,
        user.encSecretKey,
        akB64,
        mkB64,
        (loadingText: string) => this.setState({ loadingText })
      );
      this.setState({ loadingText: "Communicating with server..." });
      const mutation = !!draft.uuid
        ? UPDATE_ITEM_MUTATION
        : CREATE_ITEM_MUTATION;
      const variables: any = {
        id: draft.uuid,
        params: {
          content: encNoteContent,
          contentType: draft.contentType,
          encItemKey,
          parentId:
            draft.parentId === user.username ? undefined : draft.parentId
        }
      };
      const mutationResponse = await client.mutate<
        ICreateItemMutationResponse | IUpdateItemMutationResponse
      >({ mutation, variables });
      let item: Item;
      if (!!draft.uuid) {
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
      this.setState({
        loading: false,
        loadingText: undefined,
        isPreview: true
      });
      window.scrollTo(0, 0);
      dispatch(upsertRawItem(item));
      dispatch(
        upsertProcessedItem(
          item.uuid,
          Date.now(),
          draft.contentType,
          draft.draftContent
        )
      );
      let updatedStructure = [...structure[draft.parentId]];
      const itemIdx = updatedStructure.indexOf(item.uuid);
      if (itemIdx < 0) {
        updatedStructure = [item.uuid, ...updatedStructure];
      }
      const draftIdx = updatedStructure.indexOf(draftId);
      if (draftIdx >= 0) {
        updatedStructure.splice(draftIdx, 1);
      }
      dispatch(setStructure(draft.parentId, updatedStructure));
      dispatch(clearDraftItem(draftId));
      dispatch(
        addAlert({
          type: "success",
          timestamp: item.updatedAt,
          content: `${draft.uuid ? "Updated" : "Created"} ${
            draft.contentType
          } '${(draft.contentType === "note"
            ? draft.draftContent.title
            : draft.draftContent.dirName) || "Untitled"}'.`
        })
      );
      dispatch(setSelectedItemId(item.uuid));
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed saving item!");
      this.setState({ loading: false, loadingText: undefined });
      this.props.dispatch(
        addAlert({
          type: "error",
          timestamp: Date.now(),
          content: errors[0] || "Failed saving item!"
        })
      );
    }
  };

  protected handleDeleteNote = async () => {
    try {
      const { client, user, itemOrDraftId, structure, dispatch } = this.props;
      if (!itemOrDraftId) {
        throw new Error("Cannot delete unidentified item!");
      }
      this.setState({
        loading: true,
        loadingText: "Deleting note from the server..."
      });
      const response = await client.mutate({
        mutation: DELETE_ITEM_MUTATION,
        variables: { id: itemOrDraftId }
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
          content: `Deleted item '${deleteItem.uuid}'.`
        })
      );
      dispatch(setStructure(dirId, updatedStructure));
      dispatch(upsertRawItem(deleteItem));
      dispatch(
        upsertProcessedItem(deleteItem.uuid, deleteItem.updatedAt, null, null)
      );
      dispatch(setSelectedItemId(updatedStructure[0]));
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed deleting item!");
      this.setState({ loading: false, loadingText: undefined });
      this.props.dispatch(
        addAlert({
          type: "error",
          timestamp: Date.now(),
          content: errors[0] || "Failed deleting item!"
        })
      );
    }
  };

  private processEditorFocus = () => {
    const { focusOn } = this.state;
    const ref =
      focusOn === "title"
        ? this.titleTextareaRef.current
        : this.dirNameTextareaRef.current || this.contentTextareaRef.current;
    if (ref) {
      const curFocusId = document.activeElement.id;
      if (curFocusId !== "search-input" && ref.id !== curFocusId) {
        ref.focus();
      }
    }
  };

  private processTitleScrollHeight = () => {
    const ref = this.titleTextareaRef.current;
    if (ref) {
      while (ref.scrollHeight > ref.clientHeight) {
        ref.rows = ref.rows + 1;
      }
    }
  };

  private processResetPreview = () => {
    const { itemOrDraftId, draftItems } = this.props;
    const { isPreview } = this.state;
    if (itemOrDraftId) {
      const draft = draftItems[itemOrDraftId];
      if (isPreview && draft && !draft.uuid) {
        this.setState({ isPreview: false });
      }
    }
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

export default connect(mapStateToProps)(withApollo(DraftEditorController));
