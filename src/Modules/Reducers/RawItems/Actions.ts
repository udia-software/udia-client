// Action serializable and unique type strings
export const UPSERT_RAW_ITEM = "rawItems/UPSERT_RAW_ITEM";
export const UPSERT_RAW_ITEMS = "rawItems/ADD_RAW_ITEMS";
export const CLEAR_RAW_ITEM = "rawItems/CLEAR_RAW_ITEM";
export const CLEAR_RAW_ITEMS = "rawItems/CLEAR_RAW_ITEMS";

export interface IUpsertRawItemAction {
  type: typeof UPSERT_RAW_ITEM;
  payload: Item;
}
export const upsertRawItem = (item: Item): IUpsertRawItemAction => ({
  type: UPSERT_RAW_ITEM,
  payload: item
});

export interface IUpsertRawItemsAction {
  type: typeof UPSERT_RAW_ITEMS;
  payload: Item[];
}
export const upsertRawItems = (items: Item[]): IUpsertRawItemsAction => ({
  type: UPSERT_RAW_ITEMS,
  payload: items
});

export interface IClearRawItemAction {
  type: typeof CLEAR_RAW_ITEM;
  payload: string;
}
export const clearRawItem = (uuid: string): IClearRawItemAction => ({
  type: CLEAR_RAW_ITEM,
  payload: uuid
});

export interface IClearRawItemsAction {
  type: typeof CLEAR_RAW_ITEMS;
}
export const clearRawItems = (): IClearRawItemsAction => ({
  type: CLEAR_RAW_ITEMS
});

export type IRawItemsActions =
  | IUpsertRawItemAction
  | IUpsertRawItemsAction
  | IClearRawItemAction
  | IClearRawItemsAction;
