import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import { addRawNotes } from "../../Modules/Reducers/Notes/Actions";
import FormFieldErrors from "../PureHelpers/FormFieldErrors";
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
      decryptedNote: DecryptedNote;
    };
  };
}

interface IState {
  count: number;
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
      count: -1,
      errors,
      cryptoManager
    };
  }

  public async componentDidMount() {
    return this.fetchAndProcessItems();
  }

  public render() {
    const { rawNotes, noteIDs } = this.props;
    const { count, errors } = this.state;
    return (
      <div>
        <h1>List Notes {count === -1 ? "(Loading)" : count}</h1>
        <FormFieldErrors errors={errors} />
        {noteIDs.map(noteUUID => {
          return (
            <div key={noteUUID}>
              {noteUUID}
              <br />
              {new Date(rawNotes[noteUUID].createdAt).toString()}
            </div>
          );
        })}
      </div>
    );
  }

  protected fetchAndProcessItems = async () => {
    try {
      const { client, user } = this.props;
      // Get items 28 at a time, because why not?
      const response = await client.query<IGetItemsResponseData>({
        query: GET_ITEMS_QUERY,
        variables: {
          params: {
            username: user.username,
            limit: 28,
            // datetime: new Date().getTime(),
            // datetime: 0,
            datetime: new Date(), // above all work! just pass in the last createdAt time returned in the array
            sort: "createdAt",
            order: "DESC"
          }
        }
      });
      const { getItems } = response.data;
      this.setState({
        count: getItems.count
      });
      this.props.dispatch(addRawNotes(getItems.items));
      // iterate through each returned item and decrypt the item if it isn't already decrypted
      for (const item of getItems.items) {
        await this.decryptNoteItem(item);
      }
    } catch (err) {
      const { errors } = parseGraphQLError(err, "Failed to get items!");
      this.setState({ errors });
    }
  };

  protected decryptNoteItem = async (item: Item, force?: boolean) => {
    const { user, decryptedNotes, akB64, mkB64 } = this.props;
    const { cryptoManager } = this.state;
    try {
      // Check if the item has already been decrypted
      // If the item has not changed since we last decrypted it, do nothing unless forced
      if (
        item.uuid in decryptedNotes &&
        !force &&
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
      if (!item.encItemKey) {
        throw new Error(
          `Note ${item.uuid} missing mandatory field 'encItemKey'!`
        );
      }

      const akBuf = Buffer.from(akB64, "base64");
      const mkBuf = Buffer.from(mkB64, "base64");
      const rawSecretKey = await cryptoManager.decryptWithSecret(
        user.encSecretKey,
        Buffer.concat([mkBuf, akBuf]).buffer
      );
      const secretKey = await cryptoManager.importSecretJsonWebKey(
        JSON.parse(Buffer.from(rawSecretKey).toString())
      );

      const rawItemKey = await cryptoManager.decryptWithSecretKey(
        item.encItemKey,
        secretKey
      );
      const itemKey = await cryptoManager.importSecretJsonWebKey(
        JSON.parse(Buffer.from(rawItemKey).toString())
      );

      // Decrypt the note using the item encryption key
      const rawNoteContent = await cryptoManager.decryptWithSecretKey(
        item.content,
        itemKey
      );
      const noteContent = JSON.parse(Buffer.from(rawNoteContent).toString());
      // tslint:disable-next-line:no-console
      console.log(noteContent);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      const newErrMsg = err.msg || `Could not decrypt note ${item.uuid}!`;
      const errors = this.state.errors;
      if (errors.indexOf(newErrMsg) < 0) {
        errors.push(newErrMsg);
      }
      this.setState({ errors });
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
  rawNotes: state.notes.rawNotes,
  akB64: state.secrets.akB64,
  mkB64: state.secrets.mkB64,
  noteIDs: state.notes.noteIDs,
  decryptedNotes: state.notes.decryptedNotes
});

export default connect(mapStateToProps)(withApollo(ListNotesController));
