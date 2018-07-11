import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { match } from "react-router";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import {
  addRawNote,
  setDecryptedNote
} from "../../Modules/Reducers/Notes/Actions";
import parseGraphQLError from "../PureHelpers/ParseGraphQLError";
import DisplayNoteView from "./DisplayNoteView";

interface IProps {
  match: match<{ uuid: string }>;
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  user: FullUser;
  akB64?: string;
  mkB64?: string;
  rawNotes: { [index: string]: Item };
  decryptedNotes: {
    [index: string]: {
      decryptedAt: number;
      decryptedNote: DecryptedNote | null;
      errors?: string[];
    };
  };
}

interface IState {
  loading: boolean;
  loadingText?: string;
  errors: string[];
  cryptoManager: CryptoManager | null;
}

class DisplayNoteController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const errors: string[] = [];
    let cryptoManager: CryptoManager | null = null;
    try {
      cryptoManager = new CryptoManager();
    } catch (err) {
      errors.push(err.message);
    }

    // check whether or not this item is already decrypted locally
    const { decryptedNotes } = props;
    const { uuid } = props.match.params;
    const decNotePayload = decryptedNotes[uuid];
    document.title = `${(decNotePayload &&
      decNotePayload.decryptedNote &&
      decNotePayload.decryptedNote.title) ||
      "Display Note"} - UDIA`;
    this.state = {
      loading: !decNotePayload,
      errors,
      cryptoManager
    };
  }

  public async componentDidMount() {
    const { uuid } = this.props.match.params;
    const {
      client,
      dispatch,
      user,
      akB64,
      mkB64,
      rawNotes,
      decryptedNotes
    } = this.props;
    const { cryptoManager } = this.state;
    // if the note is in the decryptedNotes, do nothing.
    if (uuid in decryptedNotes) {
      return;
    }
    try {
      this.setState({ loading: true });
      // check for CryptoManager
      if (!cryptoManager) {
        throw new Error("Browser does not support WebCrypto!");
      }

      let rawNote: Item;
      // item does not exist in the redux rawNotes object. Fetch it.
      if (!(uuid in rawNotes)) {
        this.setState({ loadingText: "Fetching note from the server..." });
        const response = await client.query<IGetItemResponseData>({
          query: GET_ITEM_QUERY,
          variables: { id: uuid }
        });
        const { getItem } = response.data;
        if (!getItem) {
          throw new Error("Item does not exist!");
        }
        if (getItem.user.uuid !== user.uuid) {
          throw new Error("Cannot decrypt or view unowned secret notes!");
        }
        dispatch(addRawNote(getItem));
        rawNote = getItem;
      } else {
        rawNote = rawNotes[uuid];
      }

      this.setState({ loadingText: "Decrypting note..." });
      if (!akB64 || !mkB64) {
        throw new Error("Encryption secrets not set! Please re-authenticate.");
      }
      const decryptedNote = await cryptoManager.decryptNoteFromItem(
        rawNote,
        user.encSecretKey,
        akB64,
        mkB64
      );
      dispatch(
        setDecryptedNote(rawNote.uuid, new Date().getTime(), decryptedNote)
      );
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed to display note!");
      this.setState({ errors });
    } finally {
      this.setState({ loading: false, loadingText: undefined });
    }
  }

  public render() {
    const { rawNotes, decryptedNotes } = this.props;
    const { loading, loadingText, errors } = this.state;
    const { uuid } = this.props.match.params;
    const decryptedNotePayload = decryptedNotes[uuid];
    const rawNote = rawNotes[uuid];
    return (
      <DisplayNoteView
        loading={loading}
        loadingText={loadingText}
        errors={errors}
        decryptedNotePayload={decryptedNotePayload}
        rawNote={rawNote}
      />
    );
  }
}

const GET_ITEM_QUERY = gql`
  query GetItemQuery($id: ID!, $childrenParams: ItemPaginationInput) {
    getItem(id: $id) {
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
      children(params: $childrenParams) {
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
interface IGetItemResponseData {
  getItem: Item;
}

const mapStateToProps = (state: IRootState) => ({
  user: state.auth.authUser!, // User is defined due to WithAuth wrapper
  akB64: state.secrets.akB64,
  mkB64: state.secrets.mkB64,
  rawNotes: state.notes.rawNotes,
  decryptedNotes: state.notes.decryptedNotes
});

export default connect(mapStateToProps)(withApollo(DisplayNoteController));
