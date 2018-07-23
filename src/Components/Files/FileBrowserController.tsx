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
import { setStructure } from "../../Modules/Reducers/Structure/Actions";
import { IStructureState } from "../../Modules/Reducers/Structure/Reducer";
import {
  addAlert,
  clearStatus,
  setClickedItemId,
  setStatus
} from "../../Modules/Reducers/Transient/Actions";
import { BaseTheme } from "../AppStyles";
import { FileBrowserView } from "./FileBrowserViews";
import {
  GET_ITEMS_QUERY,
  IGetItemsParams,
  IGetItemsResponseData
} from "./ItemFileShared";

const { lgScrnBrkPx } = BaseTheme;

interface IProps {
  dispatch: Dispatch;
  client: ApolloClient<NormalizedCacheObject>;
  user: FullUser;
  secrets: ISecretsState;
  rawItems: IRawItemsState;
  processedItems: IProcessedItemsState;
  structure: IStructureState;
  clickedItemId?: string;
}

interface IState {
  isLargeScreen: boolean;
  cryptoManager: CryptoManager | null;
}

class FileBrowserController extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    document.title = "File Browser - UDIA";
    const cryptoManager = this.cryptoManagerCheck();
    this.state = {
      isLargeScreen: window.innerWidth >= lgScrnBrkPx,
      cryptoManager
    };
  }

  public async componentDidMount() {
    window.addEventListener("resize", this.handleResizeEvent);
    await this.queryAndProcessUserItemsPage();
    this.setFileStructureState();
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.handleResizeEvent);
    this.props.dispatch(clearStatus());
  }

  public render() {
    const { processedItems, rawItems, clickedItemId, structure } = this.props;
    return (
      <FileBrowserView
        rawItems={rawItems}
        processedItems={processedItems}
        fileStructure={structure}
        clickedItemId={clickedItemId}
        handleClickItemEvent={this.handleClickItemEvent}
      />
    );
  }

  protected handleResizeEvent = () =>
    this.setState({
      isLargeScreen: window.innerWidth >= lgScrnBrkPx
    });

  protected handleClickItemEvent = (id: string) => () => {
    this.props.dispatch(setClickedItemId(id));
  };

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
    fromMSDateTime: number = Date.now(),
    bypassCache?: boolean
  ) => {
    const limit = 6;
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
        variables: { params }
      });
      const { getItems } = response.data;
      dispatch(upsertRawItems(getItems.items));
      for (const item of getItems.items) {
        await this.processItem(item, bypassCache);
      }
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
          dispatch(
            upsertProcessedItem(item.uuid, Date.now(), item.contentType, note)
          );
      }
    } catch (err) {
      const errMsg = err.message || `Failed to decrypt item ${item.uuid}`;
      dispatch(
        upsertProcessedItem(item.uuid, Date.now(), null, null, [errMsg])
      );
    }
  };

  private setFileStructureState = () => {
    const { dispatch, rawItems, processedItems, user, structure } = this.props;
    const userItemIds = Object.keys(rawItems)
      .reduce((acc: string[], uuid) => {
        const rawItem = rawItems[uuid];
        if (
          rawItem &&
          !rawItem.deleted &&
          uuid in processedItems &&
          acc.indexOf(uuid) < 0
        ) {
          acc.push(uuid);
        }
        return acc;
      }, structure[user.username] || [])
      .sort(this.itemIdCompareFunction);
    dispatch(setStructure(user.username, userItemIds));
  };

  private itemIdCompareFunction = (a: string, b: string) => {
    const itemA = this.props.rawItems[a] || { createdAt: parseInt(a, 10) };
    const itemB = this.props.rawItems[b] || { createdAt: parseInt(b, 10) };
    // return itemA.createdAt - itemB.createdAt; // old items at beginning, new items at end
    return itemB.createdAt - itemA.createdAt; // new items at beginning, old items at end
  };
}

const mapStateToProps = (state: IRootState) => {
  const { _persist: _0, ...structure } = state.structure;
  const { _persist: _1, ...processedItems } = state.processedItems;
  const { _persist: _2, ...rawItems } = state.rawItems;
  return {
    user: state.auth.authUser!, // Ensure wrapped in WithAuth true
    secrets: state.secrets,
    rawItems,
    processedItems,
    structure,
    clickedItemId: state.transient.clickedItemId
  };
};

export default connect(mapStateToProps)(withApollo(FileBrowserController));
