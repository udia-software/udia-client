import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import { upsertDraftItem } from "../../Modules/Reducers/DraftItems/Actions";
import { IDraftItemsState } from "../../Modules/Reducers/DraftItems/Reducer";
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
  setSelectedItemId,
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
  draftItems: IDraftItemsState;
  processedItems: IProcessedItemsState;
  structure: IStructureState;
  selectedItemId?: string;
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

  public async componentDidUpdate(prevProps: IProps) {
    let triggerSetStructure = false;
    // is there a new draft item?
    const newDrafts = Object.keys(this.props.draftItems).filter(
      id => !(id in prevProps.draftItems)
    );
    triggerSetStructure = triggerSetStructure || newDrafts.length > 0;
    if (triggerSetStructure) {
      this.setFileStructureState();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.handleResizeEvent);
    this.props.dispatch(clearStatus());
  }

  public render() {
    const {
      processedItems,
      rawItems,
      selectedItemId,
      draftItems,
      structure
    } = this.props;
    return (
      <FileBrowserView
        rawItems={rawItems}
        processedItems={processedItems}
        draftItems={draftItems}
        fileStructure={structure}
        clickedItemId={selectedItemId}
        handleClickItemEvent={this.handleClickItemEvent}
        handleClickNewNote={this.handleClickNewNote}
      />
    );
  }

  protected handleResizeEvent = () =>
    this.setState({
      isLargeScreen: window.innerWidth >= lgScrnBrkPx
    });

  protected handleClickItemEvent = (id: string) => () => {
    this.props.dispatch(setSelectedItemId(id));
  };

  protected handleClickNewNote = (id: string) => () => {
    const newDraftId = `${Date.now()}`;
    this.props.dispatch(
      upsertDraftItem(
        newDraftId,
        "note",
        {
          title: "",
          content: "",
          noteType: "markdown"
        },
        id
      )
    );
    this.props.dispatch(setSelectedItemId(newDraftId));
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
    const {
      dispatch,
      rawItems,
      processedItems,
      draftItems,
      user,
      structure
    } = this.props;
    const directory = user.username;
    const draftItemIds = Object.keys(draftItems).reduce(
      (acc: string[], createdAt) => {
        const draftPayload = draftItems[createdAt];
        if (
          draftPayload &&
          draftPayload.parentId === directory &&
          acc.indexOf(createdAt) < 0
        ) {
          acc.push(createdAt);
        }
        return acc;
      },
      structure[directory] || []
    );
    const userItemIds = Object.keys(rawItems).reduce((acc: string[], uuid) => {
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
    }, draftItemIds || []);
    const fileStructureIds = userItemIds.sort(this.itemIdCompareFunction);
    dispatch(setStructure(directory, fileStructureIds));
  };

  private itemIdCompareFunction = (a: string, b: string) => {
    let itemA = this.props.rawItems[a] || { createdAt: parseInt(a, 10) };
    if (parseInt(a, 10)) {
      if (this.props.draftItems[a]) {
        const dip = this.props.draftItems[a];
        if (dip.uuid) {
          itemA = this.props.rawItems[dip.uuid];
        }
      }
    }
    let itemB = this.props.rawItems[b] || { createdAt: parseInt(b, 10) };
    if (parseInt(b, 10)) {
      if (this.props.draftItems[b]) {
        const dip = this.props.draftItems[b];
        if (dip.uuid) {
          itemB = this.props.rawItems[dip.uuid];
        }
      }
    }
    // return itemA.createdAt - itemB.createdAt; // old items at beginning, new items at end
    return itemB.createdAt - itemA.createdAt; // new items at beginning, old items at end
  };
}

const mapStateToProps = (state: IRootState) => {
  const { _persist: _0, ...structure } = state.structure;
  const { _persist: _1, ...processedItems } = state.processedItems;
  const { _persist: _2, ...rawItems } = state.rawItems;
  const { _persist: _3, ...draftItems } = state.draftItems;
  return {
    user: state.auth.authUser!, // Ensure wrapped in WithAuth true
    secrets: state.secrets,
    rawItems,
    processedItems,
    draftItems,
    structure,
    selectedItemId: state.transient.selectedItemId
  };
};

export default connect(mapStateToProps)(withApollo(FileBrowserController));