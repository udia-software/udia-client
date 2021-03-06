export const UPSERT_PROCESSED_ITEM = "processedItems/UPSERT_PROCESSED_ITEM";
export const CLEAR_PROCESSED_ITEMS = "processedItems/CLEAR_PROCESSED_ITEMS";

export interface IUpsertProcessedItemAction {
  type: typeof UPSERT_PROCESSED_ITEM;
  payload: {
    uuid: string;
    processedAt: number;
    contentType: "note" | "directory" | null;
    processedContent: DecryptedNote | DecryptedDirectory | null;
    errors?: string[];
  };
}
export const upsertProcessedItem = (
  uuid: string,
  processedAt: number,
  contentType: "note" | "directory" | null,
  processedContent: DecryptedNote | DecryptedDirectory | null,
  errors?: string[]
): IUpsertProcessedItemAction => ({
  type: UPSERT_PROCESSED_ITEM,
  payload: {
    uuid,
    processedAt,
    contentType,
    processedContent,
    errors
  }
});

export interface IClearProcessedItemsAction {
  type: typeof CLEAR_PROCESSED_ITEMS;
}
export const clearProcessedItems = (): IClearProcessedItemsAction => ({
  type: CLEAR_PROCESSED_ITEMS
});

export type IProcessedItemsAction =
  | IUpsertProcessedItemAction
  | IClearProcessedItemsAction;
