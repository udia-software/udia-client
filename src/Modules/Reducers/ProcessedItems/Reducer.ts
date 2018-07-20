import {
  CLEAR_PROCESSED_ITEMS,
  IProcessedItemsAction,
  UPSERT_PROCESSED_ITEM
} from "./Actions";

export interface IProcessedItemsState {
  [uuid: string]: ProcessedItemPayload;
}

const DefaultProcessedItemsState = Object.create(null);

export default (
  state: IProcessedItemsState = DefaultProcessedItemsState,
  action: IProcessedItemsAction
) => {
  switch (action.type) {
    case UPSERT_PROCESSED_ITEM: {
      const { uuid, processedAt, processedContent, errors } = action.payload;
      return {
        ...state,
        [uuid]: { processedAt, processedContent, errors }
      };
    }
    case CLEAR_PROCESSED_ITEMS: {
      return { ...DefaultProcessedItemsState };
    }
    default:
      return state;
  }
};
