import React, { ChangeEventHandler, Component } from "react";
import { withApollo, WithApolloClient } from "react-apollo";
import { connect } from "react-redux";
import { match, Redirect } from "react-router";
import { Dispatch } from "redux";
import { IRootState } from "../../Modules/ConfigureReduxStore";
import CryptoManager from "../../Modules/Crypto/CryptoManager";
import { upsertDraftItem } from "../../Modules/Reducers/DraftItems/Actions";
import { IDraftItemsState } from "../../Modules/Reducers/DraftItems/Reducer";
import { upsertProcessedItem } from "../../Modules/Reducers/ProcessedItems/Actions";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import {
  upsertRawItem,
  upsertRawItems
} from "../../Modules/Reducers/RawItems/Actions";
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
  GET_ITEM_QUERY,
  GET_ITEMS_QUERY,
  IGetItemResponseData,
  IGetItemsParams,
  IGetItemsResponseData,
  IItemSubscriptionParams,
  IItemSubscriptionPayload,
  ITEM_SUBSCRIPTION
} from "./ItemFileShared";

const { smScrnBrkPx } = BaseTheme;

interface IProps {
  match: match<{ id?: string }>;
  dispatch: Dispatch;
  user: FullUser;
  secrets: ISecretsState;
  rawItems: IRawItemsState;
  draftItems: IDraftItemsState;
  processedItems: IProcessedItemsState;
  structure: IStructureState;
  selectedItemId?: string;
}

interface IState {
  isSmallScreen: boolean;
  cryptoManager: CryptoManager | null;
  redirectToId?: string | boolean;
  searchValue: string;
  searchResults: string[];
}

class FileBrowserController extends Component<
  WithApolloClient<IProps>,
  IState
> {
  private itemObserver: ZenObservable.Subscription | null = null;
  constructor(props: WithApolloClient<IProps>) {
    super(props);
    document.title = "File Browser - UDIA";
    const cryptoManager = this.cryptoManagerCheck();
    this.state = {
      isSmallScreen: window.innerWidth < smScrnBrkPx,
      cryptoManager,
      searchValue: "",
      searchResults: []
    };
  }

  public async componentDidMount() {
    this.setFileStructureState();
    window.addEventListener("resize", this.handleResizeEvent);
    let nextPageMS: number | undefined;
    do {
      nextPageMS = await this.queryAndProcessUserItemsPage(
        nextPageMS,
        nextPageMS ? 32 : 1, // first pass, get one item. Subsequent passes, get 32 items
        nextPageMS ? false : true // first pass, bypassCache. Subsequent passes, use cache-first
      );
    } while (nextPageMS);
    this.setFileStructureState();
    await this.subscribeToUserItems();
  }

  public componentDidUpdate(prevProps: IProps) {
    const {
      match: {
        params: { id: urlParamId }
      },
      selectedItemId,
      draftItems,
      processedItems,
      rawItems
    } = this.props;

    // have draft lengths changed
    let triggerSetStructure =
      Object.keys(prevProps.draftItems).length !==
      Object.keys(draftItems).length;

    if (!triggerSetStructure) {
      // have processed items count changed
      const newPIKeys = Object.keys(processedItems);
      const oldPIKeys = Object.keys(prevProps.processedItems);
      triggerSetStructure = newPIKeys.length !== oldPIKeys.length;
    }
    if (!triggerSetStructure) {
      // have raw items count changed
      const newRIKeys = Object.keys(rawItems);
      const oldRIKeys = Object.keys(prevProps.rawItems);
      triggerSetStructure = newRIKeys.length !== oldRIKeys.length;
    }
    if (!triggerSetStructure) {
      // have processed items content changed
      Object.keys(processedItems).forEach(id => {
        const oldPI = prevProps.processedItems[id];
        const newPI = processedItems[id];
        triggerSetStructure =
          triggerSetStructure || oldPI.processedAt !== newPI.processedAt;
      });
    }

    if (triggerSetStructure) {
      this.setFileStructureState();
    }

    // handle small screen redirection
    if (this.state.isSmallScreen && !this.state.redirectToId) {
      // no selected item id, redirect to list
      if (!selectedItemId) {
        this.setState({ redirectToId: true });
      }
      // url parameter has changed?
      else if (urlParamId && urlParamId !== selectedItemId) {
        // check for draft
        if (
          selectedItemId in draftItems &&
          draftItems[selectedItemId].uuid === urlParamId
        ) {
          this.setState({ redirectToId: selectedItemId });
        } else {
          this.setState({ redirectToId: true });
        }
      }
    }
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.handleResizeEvent);
    this.props.dispatch(clearStatus());
    if (this.itemObserver) {
      this.itemObserver.unsubscribe();
    }
  }

  public render() {
    const {
      match: {
        params: { id: urlParamId }
      },
      processedItems,
      rawItems,
      selectedItemId,
      draftItems,
      structure,
      user
    } = this.props;
    const {
      isSmallScreen,
      redirectToId,
      searchValue,
      searchResults
    } = this.state;

    if (isSmallScreen) {
      if (redirectToId === true && urlParamId) {
        return <Redirect to="/file" />;
      }
      if (redirectToId && redirectToId !== true && !urlParamId) {
        return <Redirect to={`/file/${redirectToId}`} push={true} />;
      }
    }
    return (
      <FileBrowserView
        urlParamId={urlParamId}
        rootDirName={user.username}
        processedItems={processedItems}
        draftItems={draftItems}
        rawItems={rawItems}
        fileStructure={structure}
        searchValue={searchValue}
        searchResults={searchResults}
        selectedItemId={selectedItemId}
        isSmallScreen={isSmallScreen}
        handleClickItemEvent={this.handleClickItemEvent}
        handleClickNewNote={this.handleClickNewNote}
        handleClickNewDirectory={this.handleClickNewDirectory}
        handleChangeSearchValue={this.handleChangeSearchValue}
      />
    );
  }

  protected handleResizeEvent = () =>
    this.setState({
      isSmallScreen: window.innerWidth < smScrnBrkPx
    });

  protected handleClickItemEvent = (id: string) => () => {
    const { dispatch, draftItems } = this.props;
    let redirectToId = id;
    const existingDraft = draftItems[id];
    if (existingDraft && existingDraft.uuid) {
      dispatch(setSelectedItemId(existingDraft.uuid));
      redirectToId = existingDraft.uuid;
    } else {
      dispatch(setSelectedItemId(id));
    }
    const { isSmallScreen } = this.state;
    if (isSmallScreen) {
      this.setState({ redirectToId });
    }
  };

  protected handleClickNewNote = (parentId: string) => () => {
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
        parentId
      )
    );
    this.props.dispatch(setSelectedItemId(newDraftId));
    const { isSmallScreen } = this.state;
    if (isSmallScreen) {
      this.setState({ redirectToId: newDraftId });
    }
  };

  protected handleClickNewDirectory = (parentId: string) => () => {
    const newDraftId = `${Date.now()}`;
    this.props.dispatch(
      upsertDraftItem(
        newDraftId,
        "directory",
        { dirName: "testnewdir" },
        parentId
      )
    );
    this.props.dispatch(setSelectedItemId(newDraftId));
  };

  protected handleChangeSearchValue: ChangeEventHandler<
    HTMLInputElement
  > = e => {
    const searchValue = e.currentTarget.value;
    const { processedItems, draftItems } = this.props;
    const searchResults: string[] = [];
    if (searchValue) {
      const lcSearchValue = searchValue.toLowerCase();
      searchResults.push(
        ...Object.keys(draftItems).reduce((acc: string[], draftId) => {
          const di = draftItems[draftId];
          if (di) {
            switch (di.contentType) {
              case "note":
                if (
                  di.draftContent.content
                    .toLowerCase()
                    .includes(lcSearchValue) ||
                  di.draftContent.title.toLowerCase().includes(lcSearchValue)
                ) {
                  acc.push(draftId);
                }
                break;
              case "directory":
                if (
                  di.draftContent.dirName.toLowerCase().includes(lcSearchValue)
                ) {
                  acc.push(draftId);
                }
                break;
            }
          }
          return acc;
        }, [])
      );
      searchResults.push(
        ...Object.keys(processedItems).reduce((acc: string[], uuid) => {
          const pi = processedItems[uuid];
          if (pi) {
            switch (pi.contentType) {
              case "note":
                if (
                  pi.processedContent.content
                    .toLowerCase()
                    .includes(lcSearchValue) ||
                  pi.processedContent.title
                    .toLowerCase()
                    .includes(lcSearchValue)
                ) {
                  acc.push(uuid);
                }
                break;
              case "directory":
                if (
                  pi.processedContent.dirName
                    .toLowerCase()
                    .includes(lcSearchValue)
                ) {
                  acc.push(uuid);
                }
                break;
            }
          }
          return acc;
        }, [])
      );
      searchResults.sort(this.itemIdCompareFunction);
      this.props.dispatch(setSelectedItemId(searchResults[0]));
    } else {
      this.setFileStructureState();
    }
    this.setState({ searchValue, searchResults });
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
    fromMSDateTime: number = Math.ceil(Date.now() / 45000) * 45000, // ceil to future 45s increments
    limit: number,
    bypassCache?: boolean
  ) => {
    let nextMSDatetime: number | undefined;
    try {
      const { dispatch, client, user } = this.props;
      dispatch(setStatus("loading", "Fetching items..."));
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
      for (const item of getItems.items) {
        await this.processItem(item, bypassCache);
      }
      if (getItems.items.length < limit) {
        nextMSDatetime = undefined;
      } else {
        const createdAts = getItems.items.map(item => item.createdAt);
        nextMSDatetime = Math.min(...createdAts);
      }
      dispatch(clearStatus());
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      this.props.dispatch(
        setStatus("error", err.message || "Failed to get items!")
      );
    }
    return nextMSDatetime;
  };

  private subscribeToUserItems = async () => {
    try {
      const { client, user } = this.props;
      const params: IItemSubscriptionParams = { userId: user.uuid };
      const newItemObserver = client
        .subscribe<{ data: IItemSubscriptionPayload }>({
          query: ITEM_SUBSCRIPTION,
          variables: { params }
        })
        .subscribe(async payload => {
          if (payload && payload.data) {
            const {
              itemSubscription: { uuid, type, timestamp }
            } = payload.data;
            const queryResponse = await client.query<IGetItemResponseData>({
              query: GET_ITEM_QUERY,
              variables: { id: uuid },
              fetchPolicy: "network-only"
            });
            const { getItem } = queryResponse.data;
            this.props.dispatch(upsertRawItem(getItem));
            await this.processItem(getItem, true);
            const processedItem = this.props.processedItems[getItem.uuid];
            let content = "";
            switch (type) {
              case "ITEM_CREATED":
                content = "Created ";
                break;
              case "ITEM_UPDATED":
                content = "Updated ";
                break;
              case "ITEM_DELETED": {
                content = "Deleted ";
                const dirId =
                  (getItem.parent && getItem.parent.uuid) || user.username;
                const updatedStructure = [...this.props.structure[dirId]];
                const delIdx = updatedStructure.indexOf(getItem.uuid);
                if (delIdx >= 0) {
                  updatedStructure.splice(delIdx, 1);
                  this.props.dispatch(setStructure(dirId, updatedStructure));
                  this.props.dispatch(setSelectedItemId(updatedStructure[0]));
                }
                break;
              }
            }
            switch (processedItem.contentType) {
              case "note":
                content += `note '${processedItem.processedContent.title ||
                  "Untitled"}'.`;
                break;
              case "directory":
                content += `directory '${
                  processedItem.processedContent.dirName
                }'.`;
                break;
              default:
                content += `item '${getItem.uuid}'.`;
                break;
            }
            this.props.dispatch(
              addAlert({ type: "success", timestamp, content })
            );
          }
        });
      this.itemObserver = newItemObserver;
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
  };

  private processItem = async (item: Item, bypassCache?: boolean) => {
    const { dispatch, user, processedItems, secrets } = this.props;
    const { cryptoManager } = this.state;
    try {
      if (
        // we've procesed this item already
        item.uuid in processedItems &&
        // and the item hasn't been updated since we last processed it
        processedItems[item.uuid].processedAt > item.updatedAt &&
        // and we are not bypassing the cache
        !bypassCache
      ) {
        return;
      } else if (!cryptoManager) {
        this.props.dispatch(setStatus("error", "No Crypto!"));
        throw new Error("Browser does not support Web Crypto!");
      } else if (!secrets.akB64 || !secrets.mkB64) {
        this.props.dispatch(setStatus("error", "No AK or MK!"));
        throw new Error("Encryption secrets not set! Please re-authenticate.");
      } else if (item.deleted) {
        dispatch(upsertProcessedItem(item.uuid, Date.now(), null, null));
        return;
      }
      switch (item.contentType) {
        case "note":
          const note = await cryptoManager.decryptNoteFromItem(
            item,
            user.encSecretKey,
            user.pubVerifyKey,
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
      processedItems,
      draftItems,
      user,
      structure,
      selectedItemId
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
    const userItemIds = Object.keys(this.props.rawItems).reduce(
      (acc: string[], uuid) => {
        const rawItem = this.props.rawItems[uuid];
        if (
          rawItem &&
          !rawItem.deleted &&
          uuid in processedItems &&
          acc.indexOf(uuid) < 0
        ) {
          acc.push(uuid);
        }
        return acc;
      },
      draftItemIds || []
    );
    const fileStructureIds = userItemIds.sort(this.itemIdCompareFunction);
    dispatch(setStructure(directory, fileStructureIds));
    if (!selectedItemId) {
      dispatch(setSelectedItemId(fileStructureIds[0]));
    }
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
