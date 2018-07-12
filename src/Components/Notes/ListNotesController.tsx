import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import {
  addRawNotes,
  setDecryptedNote
} from "../../Modules/Reducers/Notes/Actions";
import FieldErrors from "../PureHelpers/FieldErrors";
import parseGraphQLError from "../PureHelpers/ParseGraphQLError";

interface IProps {
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  user: FullUser;
  akB64?: string;
  mkB64?: string;
  noteIDs: string[];
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
  errors: string[];
  cryptoManager: CryptoManager | null;
}

class ListNotesController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "List Notes - UDIA";
    const errors: string[] = [];
    let cryptoManager: CryptoManager | null = null;
    try {
      cryptoManager = new CryptoManager();
    } catch (err) {
      errors.push(err.message);
    }
    this.state = {
      errors,
      cryptoManager
    };
  }

  public async componentDidMount() {
    let nextPageMS = await this.fetchAndProcessNoteItemsPage();
    do {
      nextPageMS = await this.fetchAndProcessNoteItemsPage(nextPageMS);
    } while (nextPageMS);
  }

  public render() {
    const { rawNotes, decryptedNotes, noteIDs } = this.props;
    const { errors } = this.state;
    return (
      <div>
        <FieldErrors errors={errors} />
        <ul>
          {noteIDs.map(uuid => {
            const { decryptedNote, errors: noteErrors = [] } = decryptedNotes[
              uuid
            ] || { decryptedNote: undefined, errors: [] };
            const noteTitle = decryptedNote
              ? decryptedNote.title
              : noteErrors
                ? "ERROR!"
                : "Decrypting...";
            return (
              <li key={uuid}>
                <Link to={`/note/view/${uuid}`}>
                  <strong>{noteTitle}</strong>
                  <br />
                  <span>
                    <strong>Created At:</strong>{" "}
                    {new Date(rawNotes[uuid].createdAt).toString()}
                  </span>
                  <FieldErrors errors={noteErrors} />
                </Link>
              </li>
            );
          })}
          {noteIDs.length === 0 && <li>No Items</li>}
        </ul>
      </div>
    );
  }

  protected fetchAndProcessNoteItemsPage = async (
    fromMilliSecondPageDateTime?: number
  ) => {
    const limitPageSize = 28; // Get items 28 at a time, because why not?
    // last item createdAt number holder. (If null, we don't need to get more pages.)
    let nextPageMillisecondDateTime: number | undefined;
    try {
      const { client, user } = this.props;
      const response = await client.query<IGetItemsResponseData>({
        query: GET_ITEMS_QUERY,
        variables: {
          params: {
            username: user.username,
            limit: limitPageSize,
            datetime: fromMilliSecondPageDateTime,
            sort: "createdAt",
            order: "DESC"
          }
        }
      });
      const { getItems } = response.data;
      this.props.dispatch(addRawNotes(getItems.items));
      // iterate through each returned item and decrypt the item if it isn't already decrypted
      for (const item of getItems.items) {
        await this.processNoteItem(item);
        nextPageMillisecondDateTime = item.createdAt;
      }
      // We have not filled our limit page, we don't need to fetch more items
      if (getItems.items.length < limitPageSize) {
        nextPageMillisecondDateTime = undefined;
      }
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed to get items!");
      this.setState({ errors });
    }
    return nextPageMillisecondDateTime;
  };

  protected processNoteItem = async (item: Item) => {
    const { dispatch, user, decryptedNotes, akB64, mkB64 } = this.props;
    const { cryptoManager } = this.state;
    try {
      // Check if the item has already been decrypted
      // If the item has not changed since we last decrypted it, do nothing
      if (
        item.uuid in decryptedNotes &&
        decryptedNotes[item.uuid].decryptedAt >= item.updatedAt
      ) {
        return;
      }
      if (!cryptoManager) {
        throw new Error("Browser does not support WebCrypto!");
      }
      if (!akB64 || !mkB64) {
        throw new Error("Encryption secrets not set! Please re-authenticate.");
      }
      const noteContent: DecryptedNote = await cryptoManager.decryptNoteFromItem(
        item,
        user.encSecretKey,
        akB64,
        mkB64
      );
      dispatch(setDecryptedNote(item.uuid, new Date().getTime(), noteContent));
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      const newErrMsg = err.message || `Failed to decrypt note ${item.uuid}!`;
      dispatch(
        setDecryptedNote(item.uuid, new Date().getTime(), null, [newErrMsg])
      );
    }
  };
}

const GET_ITEMS_QUERY = gql`
  query GetItemsQuery(
    $params: ItemPaginationInput
    $childrenParams: ItemPaginationInput
  ) {
    getItems(params: $params) {
      count
      items {
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
  }
`;

interface IGetItemsResponseData {
  getItems: {
    count: number;
    items: Item[];
  };
}

const mapStateToProps = (state: IRootState) => ({
  user: state.auth.authUser!, // WithAuth wrapper ensures user is defined
  akB64: state.secrets.akB64,
  mkB64: state.secrets.mkB64,
  rawNotes: state.notes.rawNotes,
  noteIDs: state.notes.noteIDs,
  decryptedNotes: state.notes.decryptedNotes
});

export default connect(mapStateToProps)(withApollo(ListNotesController));
