import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import React, { ChangeEventHandler, Component } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import {
  addRawNotes,
  setDecryptedNote
} from "../../Modules/Reducers/Notes/Actions";
import { isDraftingNewNote } from "../../Modules/Reducers/Notes/Selectors";
import { setClickedNoteId } from "../../Modules/Reducers/Transient/Actions";
import { BaseTheme } from "../AppStyles";
import parseGraphQLError from "../PureHelpers/ParseGraphQLError";
import ListNotesView from "./ListNotesView";

const { lgScrnBrkPx } = BaseTheme;

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
  draftingNote: boolean;
  clickedNoteId?: string;
}

interface IState {
  loading: boolean;
  width: number;
  errors: string[];
  cryptoManager: CryptoManager | null;
  searchString: string;
  bypassedCacheDateMS?: number;
  searchResultIDs: string[];
  clickedNoteId?: string;
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
      loading: true,
      width: window.innerWidth,
      errors,
      cryptoManager,
      searchString: "",
      searchResultIDs: []
    };
  }

  public async componentDidMount() {
    window.addEventListener("resize", this.handleResizeEvent);
    let nextPageMS: number | undefined;
    do {
      nextPageMS = await this.fetchAndProcessNoteItemsPage(nextPageMS);
      // tslint:disable-next-line:no-console
    } while (nextPageMS);
    const isLargeScreen = this.state.width >= lgScrnBrkPx;
    const { noteIDs, clickedNoteId } = this.props;
    this.setState({
      loading: false,
      clickedNoteId: isLargeScreen
        ? clickedNoteId
          ? clickedNoteId
          : noteIDs[0]
        : undefined
    });
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.handleResizeEvent);
  }

  public render() {
    const { rawNotes, decryptedNotes, noteIDs, draftingNote } = this.props;
    const {
      loading,
      width,
      errors,
      searchString,
      bypassedCacheDateMS,
      searchResultIDs,
      clickedNoteId
    } = this.state;
    const displayNotes = searchString ? searchResultIDs : noteIDs;
    const isLargeScreen = width >= lgScrnBrkPx;

    return (
      <ListNotesView
        isLargeScreen={isLargeScreen}
        loading={loading}
        draftingNote={draftingNote}
        displayNotes={displayNotes}
        rawNotes={rawNotes}
        decryptedNotes={decryptedNotes}
        bypassedCacheDateMS={bypassedCacheDateMS}
        searchString={searchString}
        clickedNoteId={clickedNoteId}
        errors={errors}
        handleChangeSearchString={this.handleChangeSearchString}
        handleListNoteItemClicked={this.handleListNoteItemClicked}
        handleReloadNotesBypassCache={this.handleReloadNotesBypassCache}
      />
    );
  }

  protected handleReloadNotesBypassCache = async () => {
    if (!this.state.loading) {
      this.setState({
        loading: true,
        bypassedCacheDateMS: new Date().getTime()
      });
      let nextPageMS: number | undefined = new Date().getTime();
      do {
        nextPageMS = await this.fetchAndProcessNoteItemsPage(nextPageMS, true);
        // tslint:disable-next-line:no-console
      } while (nextPageMS);
      this.setState({ loading: false });
    }
  };

  protected handleChangeSearchString: ChangeEventHandler<
    HTMLInputElement
  > = e => {
    const searchString = e.currentTarget.value;
    const { decryptedNotes, noteIDs } = this.props;
    const searchResultIDs = Object.keys(decryptedNotes).reduceRight(
      (accumulator: typeof noteIDs, uuid) => {
        const decNotePayload = decryptedNotes[uuid];
        if (decNotePayload.decryptedNote) {
          const { title, content } = decNotePayload.decryptedNote;
          if (
            title.toLowerCase().indexOf(searchString.toLowerCase()) >= 0 ||
            content.toLowerCase().indexOf(searchString.toLowerCase()) >= 0
          ) {
            accumulator.push(uuid);
          }
        }
        return accumulator;
      },
      []
    );
    const isLargeScreen = this.state.width >= lgScrnBrkPx;
    this.setState({
      searchString,
      searchResultIDs,
      clickedNoteId: isLargeScreen
        ? searchResultIDs.length
          ? searchResultIDs[0]
          : undefined
        : undefined
    });
  };

  protected handleListNoteItemClicked = (uuid: string) => () => {
    this.setState({ clickedNoteId: uuid });
    this.props.dispatch(setClickedNoteId(uuid));
  };

  protected fetchAndProcessNoteItemsPage = async (
    fromMilliSecondPageDateTime?: number,
    bypassCache?: boolean
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
        },
        fetchPolicy: bypassCache ? "network-only" : "cache-first"
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

  protected handleResizeEvent = () => {
    const isLargeScreen = window.innerWidth >= lgScrnBrkPx;
    this.setState({
      width: window.innerWidth,
      clickedNoteId: isLargeScreen ? this.props.noteIDs[0] : undefined
    });
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
  decryptedNotes: state.notes.decryptedNotes,
  draftingNote: isDraftingNewNote(state),
  clickedNoteId: state.transient.clickedNoteId
});

export default connect(mapStateToProps)(withApollo(ListNotesController));
