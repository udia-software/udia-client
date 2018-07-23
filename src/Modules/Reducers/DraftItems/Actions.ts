export const UPSERT_DRAFT_ITEM = "draftItems/UPSERT_DRAFT_ITEM";
export const CLEAR_DRAFT_ITEM = "draftItems/CLEAR_DRAFT_ITEM";
export const CLEAR_DRAFT_ITEMS = "draftItems/CLEAR_DRAFT_ITEMS";

export interface IUpsertDraftItemAction {
  type: typeof UPSERT_DRAFT_ITEM;
  payload: {
    createdAt: string;
    contentType: "note" | "directory" | null;
    draftContent: DecryptedNote | DecryptedDirectory | null;
    parentId: string; // determines draft hierarchy
    uuid?: string; // if set, indicates an edit of existing item, otherwise new draft
    errors?: string[];
  };
}
export const upsertDraftItem = (
  createdAt: string,
  contentType: "note" | "directory",
  draftContent: DecryptedNote | DecryptedDirectory,
  parentId: string,
  uuid?: string,
  errors?: string[]
): IUpsertDraftItemAction => ({
  type: UPSERT_DRAFT_ITEM,
  payload: {
    createdAt,
    contentType,
    draftContent,
    parentId,
    uuid,
    errors
  }
});

export interface IClearDraftItemAction {
  type: typeof CLEAR_DRAFT_ITEM;
  payload: string;
}
export const clearDraftItem = (createdAt: string) => ({
  type: CLEAR_DRAFT_ITEM,
  payload: createdAt
});

export interface IClearDraftItemsAction {
  type: typeof CLEAR_DRAFT_ITEMS;
}
export const clearDraftItems = (): IClearDraftItemsAction => ({
  type: CLEAR_DRAFT_ITEMS
});

export type IDraftItemsAction =
  | IUpsertDraftItemAction
  | IClearDraftItemAction
  | IClearDraftItemsAction;
