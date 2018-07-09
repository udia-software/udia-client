import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import React, { ChangeEventHandler, Component, MouseEventHandler } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import {
  discardDraft,
  setDraftNoteContent,
  setDraftNoteTitle
} from "../../Modules/Reducers/Notes/Actions";
import {
  IDraftNote,
  NEW_DRAFT_NOTE
} from "../../Modules/Reducers/Notes/Reducer";
import { FullUser, User } from "../../Types";
import parseGraphQLError from "../PureHelpers/ParseGraphQLError";
import DraftNoteView from "./DraftNoteView";

interface IProps {
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  user: FullUser;
  draftNote: IDraftNote;
  akB64?: string;
  mkB64?: string;
}

interface IState {
  loading: boolean;
  loadingText?: string;
  preview: boolean;
  errors: string[];
  titleErrors: string[];
  contentErrors: string[];
  cryptoManager: CryptoManager | null;
}

const itemContentType = "note";

class CreateNoteController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "Draft Note - UDIA";
    const errors: string[] = [];
    let cryptoManager: CryptoManager | null = null;
    try {
      cryptoManager = new CryptoManager();
    } catch (err) {
      errors.push(err.message);
    }
    this.state = {
      loading: false,
      preview: false,
      errors,
      titleErrors: [],
      contentErrors: [],
      cryptoManager
    };
  }

  public render() {
    const { draftNote } = this.props;
    const {
      loading,
      loadingText,
      errors,
      titleErrors,
      contentErrors,
      preview
    } = this.state;
    return (
      <DraftNoteView
        loading={loading}
        loadingText={loadingText}
        errors={[...errors, ...titleErrors, ...contentErrors]}
        preview={preview}
        draftNote={draftNote}
        handleDiscardDraftNote={this.handleDiscardDraftNote}
        handleTogglePreview={this.handleTogglePreview}
        handleChangeNoteTitle={this.handleChangeNoteTitle}
        handleChangeNoteContent={this.handleChangeNoteContent}
        handleSubmit={this.handleSubmitNewNote}
      />
    );
  }

  protected handleChangeNoteTitle: ChangeEventHandler<HTMLInputElement> = e => {
    this.props.dispatch(
      setDraftNoteTitle(NEW_DRAFT_NOTE, e.currentTarget.value)
    );
    this.setState({ titleErrors: [] });
  };

  protected handleChangeNoteContent: ChangeEventHandler<
    HTMLTextAreaElement
  > = e => {
    this.props.dispatch(
      setDraftNoteContent(NEW_DRAFT_NOTE, e.currentTarget.value)
    );
    this.setState({ contentErrors: [] });
  };

  protected handleDiscardDraftNote: MouseEventHandler<
    HTMLButtonElement
  > = e => {
    this.props.dispatch(discardDraft(NEW_DRAFT_NOTE));
  };

  protected handleTogglePreview: MouseEventHandler<HTMLButtonElement> = e => {
    this.setState({
      preview: !this.state.preview
    });
  };

  protected handleSubmitNewNote: MouseEventHandler<
    HTMLButtonElement
  > = async e => {
    try {
      e.preventDefault();
      const { client, draftNote, user, akB64, mkB64 } = this.props;
      const { cryptoManager } = this.state;
      if (!cryptoManager) {
        throw new Error("Browser does not support WebCrypto!");
      }
      if (!draftNote.title) {
        this.setState({ titleErrors: ["Title cannot be empty!"] });
        return;
      }
      if (!draftNote.content) {
        this.setState({ contentErrors: ["Content cannot be empty!"] });
        return;
      }
      if (!akB64 || !mkB64) {
        throw new Error("Encryption secrets not set! Please re-authenticate.");
      }

      // Decrypt the user's private signing key
      this.setState({
        loading: true,
        loadingText: "Decrypting signing key...",
        errors: []
      });
      const akBuf = Buffer.from(akB64, "base64");
      const rawSignKey = await cryptoManager.decryptWithSecret(
        user.encPrivateSignKey,
        akBuf.buffer
      );
      const signKey = await cryptoManager.importPrivateSignJsonWebKey(
        JSON.parse(Buffer.from(rawSignKey).toString())
      );

      // Decrypt the user's private secret key
      this.setState({
        loadingText: "Decrypting secret key..."
      });
      const mkBuf = Buffer.from(mkB64, "base64");
      const rawSecretKey = await cryptoManager.decryptWithSecret(
        user.encSecretKey,
        Buffer.concat([mkBuf, akBuf]).buffer
      );
      const secretKey = await cryptoManager.importSecretJsonWebKey(
        JSON.parse(Buffer.from(rawSecretKey).toString())
      );

      // Sign the note with the user's signing key
      this.setState({ loadingText: "Signing the raw note..." });
      const noteData = JSON.stringify(draftNote);
      const noteArrBuf = Buffer.from(noteData, "utf8").buffer;
      const sigArrBuf = await cryptoManager.signWithPrivateKey(
        signKey,
        noteArrBuf
      );

      // Generate new AES-GCM key for this secret note
      this.setState({ loadingText: "Generating item AES-GCM key..." });
      const itemKey = await cryptoManager.generateSymmetricEncryptionKey();

      // Encrypt the note with newly generated symmetric encryption key
      this.setState({ loadingText: "Encrypting the signed note..." });
      const encNoteContent = await cryptoManager.encryptWithSecretKey(
        noteArrBuf,
        itemKey,
        sigArrBuf
      );

      // Encrypt the item key user's secret key
      this.setState({ loadingText: "Encrypted the item encryption key..." });
      const stringifiedItemKey = JSON.stringify(itemKey);
      const itemKeyArrBuf = Buffer.from(stringifiedItemKey, "utf8").buffer;
      const encItemKey = await cryptoManager.encryptWithSecretKey(
        itemKeyArrBuf,
        secretKey
      );

      // send the data to the server
      this.setState({ loadingText: "Communicating with server..." });
      const mutationResponse = await client.mutate<ICreateItemMutationResponse>(
        {
          mutation: CREATE_ITEM_MUTATION,
          variables: {
            params: {
              content: encNoteContent,
              contentType: itemContentType,
              encItemKey
            }
          }
        }
      );

      // tslint:disable-next-line:no-console
      console.log(mutationResponse);
      this.setState({
        loading: false,
        loadingText: undefined,
        errors: [],
        titleErrors: [],
        contentErrors: []
      });
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed to create note!");
      this.setState({ loading: false, loadingText: undefined, errors });
    }
  };
}

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
      createdAt
      updatedAt
    }
  }
`;

// interface ICreateItemParam {
//   content: string;
//   contentType: string;
//   encItemKey?: string;
//   parentId?: string;
// }

interface ICreateItemMutationResponse {
  createItem: {
    uuid: string;
    content: string;
    contentType: "text" | "markdown";
    encItemKey: string;
    user: User;
    deleted: boolean;
    createdAt: number;
    updatedAt: number;
  };
}

const mapStateToProps = (state: IRootState) => ({
  user: state.auth.authUser!, // WithAuth wrapper ensures user is defined
  akB64: state.secrets.akB64,
  mkB64: state.secrets.mkB64,
  draftNote: state.notes.drafts[NEW_DRAFT_NOTE] || {
    content: "",
    title: "",
    noteType: "markdown"
  }
});

export default connect(mapStateToProps)(withApollo(CreateNoteController));
