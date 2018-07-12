import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import React, { ChangeEventHandler, Component, MouseEventHandler } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { match, Redirect } from "react-router";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import {
  addRawNote,
  discardDraft,
  setDecryptedNote,
  setDraft,
  setDraftNoteContent,
  setDraftNoteTitle,
  setDraftNoteType
} from "../../Modules/Reducers/Notes/Actions";
import {
  EDIT_DRAFT_NOTE,
  NEW_DRAFT_NOTE
} from "../../Modules/Reducers/Notes/Reducer";
import parseGraphQLError from "../PureHelpers/ParseGraphQLError";
import DraftNoteView from "./DraftNoteView";
import { fetchAndProcessNote } from "./NotesShared";

interface IProps {
  decryptedNotes: {
    [index: string]: {
      decryptedAt: number;
      decryptedNote: DecryptedNote | null;
      errors?: string[];
    };
  };
  dispatch: Dispatch;
  match: match<{ uuid?: string }>;
  client: ApolloClient<NormalizedCacheObject>;
  user: FullUser;
  drafts: {
    [index: string]: DecryptedNote;
  };
  akB64?: string;
  mkB64?: string;
  rawNotes: { [index: string]: Item };
}

interface IState {
  loading: boolean;
  loadingText?: string;
  preview: boolean;
  debounceTitleTimeout?: number;
  debounceTitle: string;
  debounceContentTimeout?: number;
  debounceContent: string;
  errors: string[];
  titleErrors: string[];
  contentErrors: string[];
  cryptoManager: CryptoManager | null;
  redirectToNote?: string;
}

const itemContentType = "note";
const debounceTimeoutMS = 200;
const defaultDraftNote = {
  content: "",
  title: "",
  noteType: "markdown"
};

class DraftNoteController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const { uuid } = this.props.match.params;
    document.title = `${!!uuid ? "Editing" : "Drafting"} Note - UDIA`;
    const errors: string[] = [];
    let cryptoManager: CryptoManager | null = null;
    try {
      cryptoManager = new CryptoManager();
    } catch (err) {
      errors.push(err.message);
    }

    const draftNote = this.getWorkingDraftNote();
    this.state = {
      loading: !!uuid,
      preview: false,
      // necessary anti-pattern for side by side render performance (input debouncing)
      debounceContent: draftNote.content,
      debounceTitle: draftNote.title,
      errors,
      titleErrors: [],
      contentErrors: [],
      cryptoManager
    };
  }

  /**
   * Logic to handle editing notes goes here
   */
  public async componentDidMount() {
    try {
      const {
        client,
        rawNotes,
        dispatch,
        decryptedNotes,
        drafts,
        user,
        akB64,
        mkB64,
        match: {
          params: { uuid }
        }
      } = this.props;
      const { cryptoManager } = this.state;
      if (!uuid) {
        // we're not editing a note, therefore we don't need to do anything else
        return;
      }

      const draftKey = this.getDraftKey();
      if (draftKey in drafts) {
        // edited note is already in the drafts
        return;
      }

      // has the note already been fetched and decrypted?
      const decryptedNotePayload = decryptedNotes[uuid];
      if (decryptedNotePayload) {
        const { decryptedNote, errors } = decryptedNotePayload;
        if (decryptedNote) {
          dispatch(setDraft(draftKey, decryptedNote));
          this.setState({
            debounceContent: decryptedNote.content,
            debounceTitle: decryptedNote.title
          });
          return;
        } else {
          this.setState({
            errors: errors ? errors : ["Failed to fetch note!"]
          });
          return;
        }
      } else {
        // guess we need to fetch the note from the API
        const { rawNote, decryptedNote } = await fetchAndProcessNote(
          cryptoManager,
          client,
          rawNotes,
          uuid,
          user,
          akB64,
          mkB64,
          (loadingText: string) => this.setState({ loadingText })
        );
        dispatch(addRawNote(rawNote));
        dispatch(
          setDecryptedNote(rawNote.uuid, new Date().getTime(), decryptedNote)
        );
        dispatch(setDraft(draftKey, decryptedNote));
        this.setState({
          debounceContent: decryptedNote.content,
          debounceTitle: decryptedNote.title
        });
      }
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed to initialize draft!");
      this.setState({ errors });
    } finally {
      this.setState({ loading: false, loadingText: undefined });
    }
  }

  public render() {
    const draftNote = this.getWorkingDraftNote();
    const {
      loading,
      loadingText,
      errors,
      titleErrors,
      contentErrors,
      preview,
      debounceTitleTimeout,
      debounceTitle,
      debounceContentTimeout,
      debounceContent,
      redirectToNote
    } = this.state;
    if (redirectToNote) {
      return <Redirect to={`/note/view/${redirectToNote}`} />;
    }
    return (
      <DraftNoteView
        loading={loading}
        loadingText={loadingText}
        errors={[...errors, ...titleErrors, ...contentErrors]}
        preview={preview}
        draftNote={draftNote}
        debouncingTitle={!!debounceTitleTimeout}
        debouncedTitle={debounceTitle}
        debouncingContent={!!debounceContentTimeout}
        debouncedContent={debounceContent}
        handleDiscardDraftNote={this.handleDiscardDraftNote}
        handleTogglePreview={this.handleTogglePreview}
        handleToggleNoteType={this.handleToggleNoteType}
        handleChangeNoteTitle={this.handleChangeNoteTitle}
        handleChangeNoteContent={this.handleChangeNoteContent}
        handleSubmit={this.handleSubmitNote}
      />
    );
  }

  protected handleChangeNoteTitle: ChangeEventHandler<
    HTMLTextAreaElement
  > = e => {
    const newTitle = e.currentTarget.value;
    this.props.dispatch(setDraftNoteTitle(this.getDraftKey(), newTitle));
    window.clearTimeout(this.state.debounceTitleTimeout);
    this.setState({
      titleErrors: [],
      debounceTitleTimeout: window.setTimeout(() => {
        this.setState({
          debounceTitle: newTitle,
          debounceTitleTimeout: undefined
        });
      }, debounceTimeoutMS)
    });
  };

  protected handleChangeNoteContent: ChangeEventHandler<
    HTMLTextAreaElement
  > = e => {
    const newContent = e.currentTarget.value;
    this.props.dispatch(setDraftNoteContent(this.getDraftKey(), newContent));
    // for side by side editing, delay content update
    window.clearTimeout(this.state.debounceContentTimeout);
    this.setState({
      contentErrors: [],
      debounceContentTimeout: window.setTimeout(() => {
        this.setState({
          debounceContent: newContent,
          debounceContentTimeout: undefined
        });
      }, debounceTimeoutMS)
    });
  };

  protected handleDiscardDraftNote: MouseEventHandler<
    HTMLButtonElement
  > = e => {
    const {
      match: {
        params: { uuid }
      }
    } = this.props;
    this.props.dispatch(discardDraft(this.getDraftKey()));
    window.clearTimeout(this.state.debounceContentTimeout);
    window.clearTimeout(this.state.debounceTitleTimeout);

    this.setState({
      debounceContent: "",
      debounceTitle: "",
      debounceContentTimeout: undefined,
      debounceTitleTimeout: undefined,
      redirectToNote: uuid
    });
  };

  protected handleTogglePreview: MouseEventHandler<HTMLButtonElement> = e => {
    const preview = !this.state.preview;
    this.setState({ preview });
  };

  protected handleToggleNoteType: ChangeEventHandler<HTMLInputElement> = e => {
    let noteType: "text" | "markdown" = "markdown";
    const rawNoteType = e.currentTarget.value;
    switch (rawNoteType) {
      case "text":
        noteType = "text";
        break;
      case "markdown":
        noteType = "markdown";
        break;
      default:
        noteType = "markdown";
        break;
    }
    this.props.dispatch(setDraftNoteType(this.getDraftKey(), noteType));
  };

  protected handleSubmitNote: MouseEventHandler<
    HTMLButtonElement
  > = async e => {
    try {
      e.preventDefault();
      const {
        dispatch,
        client,
        user,
        akB64,
        mkB64,
        match: {
          params: { uuid }
        }
      } = this.props;
      const draftNote = this.getWorkingDraftNote();
      const { cryptoManager } = this.state;

      if (!cryptoManager) {
        throw new Error("Browser does not support WebCrypto!");
      }
      if (!draftNote.content) {
        this.setState({ contentErrors: ["Content cannot be empty!"] });
        return;
      }
      if (!akB64 || !mkB64) {
        throw new Error("Encryption secrets not set! Please re-authenticate.");
      }

      this.setState({ loading: true, errors: [] });
      const {
        encNoteContent,
        encItemKey
      } = await cryptoManager.encryptNoteToItem(
        draftNote,
        user.encPrivateSignKey,
        user.encSecretKey,
        akB64,
        mkB64,
        (loadingText: string) => this.setState({ loadingText })
      );

      // send the data to the server
      this.setState({ loadingText: "Communicating with server..." });
      const mutation = !!uuid ? UPDATE_ITEM_MUTATION : CREATE_ITEM_MUTATION;
      const variables: any = {
        id: uuid,
        params: {
          content: encNoteContent,
          contentType: itemContentType,
          encItemKey
        }
      };
      const mutationResponse = await client.mutate<
        ICreateItemMutationResponse | IUpdateItemMutationResponse
      >({
        mutation,
        variables
      });
      let item: Item;
      if (!!uuid) {
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
        errors: [],
        titleErrors: [],
        contentErrors: []
      });
      dispatch(addRawNote(item));
      dispatch(setDecryptedNote(item.uuid, new Date().getTime(), draftNote));
      const draftKey = this.getDraftKey();
      dispatch(discardDraft(draftKey));
      this.setState({ redirectToNote: item.uuid });
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed to draft note!");
      this.setState({ loading: false, loadingText: undefined, errors });
    }
  };

  private getDraftKey() {
    const { uuid } = this.props.match.params;
    return uuid ? EDIT_DRAFT_NOTE(uuid) : NEW_DRAFT_NOTE;
  }

  private getWorkingDraftNote() {
    const draftKey = this.getDraftKey();
    return this.props.drafts[draftKey] || defaultDraftNote;
  }
}

// interface ICreateItemInput {
//   content: string;
//   contentType: string;
//   encItemKey?: string;
//   parentId?: string;
// }
const CREATE_ITEM_MUTATION = gql`
  mutation CreateItemMutation($params: CreateItemInput!) {
    createItem(params: $params) {
      uuid
      content
      contentType
      encItemKey
      user {
        uuid
        username
        pubVerifyKey
      }
      deleted
      parent {
        uuid
      }
      children {
        count
        items {
          uuid
        }
      }
      createdAt
      updatedAt
    }
  }
`;
interface ICreateItemMutationResponse {
  createItem: Item;
}

// interface IUpdateItemInput {
//   content?: string;
//   contentType?: string;
//   encItemKey?: string;
//   parentId?: string;
// }
const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItemMutation($id: ID!, $params: UpdateItemInput!) {
    updateItem(id: $id, params: $params) {
      uuid
      content
      contentType
      encItemKey
      user {
        uuid
        username
        pubVerifyKey
      }
      deleted
      parent {
        uuid
      }
      children {
        count
        items {
          uuid
        }
      }
      createdAt
      updatedAt
    }
  }
`;
interface IUpdateItemMutationResponse {
  updateItem: Item;
}

const mapStateToProps = (state: IRootState) => ({
  user: state.auth.authUser!, // WithAuth wrapper ensures user is defined
  akB64: state.secrets.akB64,
  mkB64: state.secrets.mkB64,
  drafts: state.notes.drafts,
  rawNotes: state.notes.rawNotes,
  decryptedNotes: state.notes.decryptedNotes
});

export default connect(mapStateToProps)(withApollo(DraftNoteController));
