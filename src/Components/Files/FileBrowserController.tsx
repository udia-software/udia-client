import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import { upsertProcessedItem } from "../../Modules/Reducers/ProcessedItems/Actions";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { upsertRawItems } from "../../Modules/Reducers/RawItems/Actions";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import { ISecretsState } from "../../Modules/Reducers/Secrets/Reducer";
import {
  addAlert,
  clearStatus,
  setStatus
} from "../../Modules/Reducers/Transient/Actions";
import { DirectoryView } from "./FileBrowserViews";
import {
  GET_ITEMS_QUERY,
  IGetItemsParams,
  IGetItemsResponseData
} from "./ItemFileShared";

interface IProps {
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  user: FullUser;
  secrets: ISecretsState;
  rawItems: IRawItemsState;
  processedItems: IProcessedItemsState;
}

interface IState {
  cryptoManager: CryptoManager | null;
  fileStructure: {
    [uuid: string]: string[]; // object of uuid to uuid[], where the root (username, no parent) is `${username}`
  };
}

class FileBrowserController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "File Browser - UDIA";
    const cryptoManager = this.cryptoManagerCheck();
    this.state = {
      cryptoManager,
      fileStructure: {
        [this.props.user.username]: [] // Special 'username' folder (semantically home)
      }
    };
  }

  public async componentDidMount() {
    await this.queryAndProcessUserItemsPage();
    this.setFileStructureState();
  }

  public componentWillUnmount() {
    this.props.dispatch(clearStatus());
  }

  public render() {
    const { processedItems } = this.props;
    const { fileStructure } = this.state;
    return (
      <div>
        {Object.keys(fileStructure).map(root => {
          const nestedItems = fileStructure[root].map(
            uuid => processedItems[uuid]
          );
          return (
            <DirectoryView
              key={root}
              dirName={root}
              nestedItems={nestedItems}
              open={true}
            />
          );
        })}
      </div>
    );
  }

  private cryptoManagerCheck() {
    let cryptoManager = null;
    try {
      cryptoManager = new CryptoManager();
    } catch (err) {
      this.props.dispatch(setStatus("error", "No Crypto!"));
      this.props.dispatch(
        addAlert({
          type: "error",
          timestamp: Date.now(),
          content: "Browser does not support Web Crypto!"
        })
      );
    }
    return cryptoManager;
  }

  private queryAndProcessUserItemsPage = async (
    fromMSDateTime?: number,
    bypassCache?: boolean
  ) => {
    const limit = 14;
    let nextMSDatetime: number | undefined;
    try {
      const { dispatch, client, user } = this.props;
      const params: Partial<IGetItemsParams> = {
        limit,
        username: user.username,
        datetime: fromMSDateTime,
        showDeleted: true // todo, make this handle no delete & stale/moved items
      };
      const response = await client.query<IGetItemsResponseData>({
        query: GET_ITEMS_QUERY,
        variables: { params },
        fetchPolicy: bypassCache ? "network-only" : "cache-first"
      });
      const { getItems } = response.data;
      dispatch(upsertRawItems(getItems.items));
      // not sure if this needs to be synchronous
      getItems.items.forEach(item => this.processItem(item, bypassCache));
      if (getItems.items.length < limit) {
        nextMSDatetime = undefined;
      } else {
        const createdAts = getItems.items.map(item => item.createdAt);
        nextMSDatetime = Math.max(...createdAts);
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
    return nextMSDatetime;
  };

  private processItem = async (item: Item, bypassCache?: boolean) => {
    const { dispatch, user, processedItems, secrets } = this.props;
    const { cryptoManager } = this.state;
    try {
      if (
        // item has been deleted or
        item.deleted || // we've procesed this item already
        (item.uuid in processedItems &&
          // and the item hasn't been updated since we last processed it
          processedItems[item.uuid].processedAt > item.updatedAt &&
          // and we are not bypassing the cache
          !bypassCache)
      ) {
        return;
      } else if (!cryptoManager) {
        this.props.dispatch(setStatus("error", "No Crypto!"));
        throw new Error("Browser does not support Web Crypto!");
      } else if (!secrets.akB64 || !secrets.mkB64) {
        this.props.dispatch(setStatus("error", "No AK or MK!"));
        throw new Error("Encryption secrets not set! Please re-authenticate.");
      }
      switch (item.contentType) {
        case "note":
          const note = await cryptoManager.decryptNoteFromItem(
            item,
            user.encSecretKey,
            secrets.akB64,
            secrets.mkB64
          );
          dispatch(upsertProcessedItem(item.uuid, Date.now(), note));
      }
    } catch (err) {
      const errMsg = err.message || `Failed to decrypt item ${item.uuid}`;
      dispatch(upsertProcessedItem(item.uuid, Date.now(), null, [errMsg]));
    }
  };

  private setFileStructureState = () => {
    const { rawItems, processedItems, user } = this.props;
    const userItems = Object.keys(rawItems).reduce((acc: string[], uuid) => {
      const rawItem = rawItems[uuid];
      if (rawItem && !rawItem.deleted && uuid in processedItems) {
        acc.push(uuid);
      }
      return acc;
    }, []);
    this.setState({
      fileStructure: {
        ...this.state.fileStructure,
        [user.username]: userItems
      }
    });
  };
}

const mapStateToProps = (state: IRootState) => ({
  user: state.auth.authUser!, // Ensure wrapped in WithAuth true
  secrets: state.secrets,
  rawItems: state.rawItems,
  processedItems: state.processedItems
});

export default connect(mapStateToProps)(withApollo(FileBrowserController));
