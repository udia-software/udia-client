import {
  CLEAR_RAW_ITEM,
  CLEAR_RAW_ITEMS,
  IRawItemsActions,
  UPSERT_RAW_ITEM,
  UPSERT_RAW_ITEMS
} from "./Actions";

export interface IRawItemsState {
  [uuid: string]: Item;
}

const DefaultRawItemsState = Object.create(null);

export default (
  state: IRawItemsState = DefaultRawItemsState,
  action: IRawItemsActions
) => {
  switch (action.type) {
    case UPSERT_RAW_ITEM: {
      const itemExists = state[action.payload.uuid];
      if (
        !itemExists ||
        (itemExists && action.payload.updatedAt >= itemExists.updatedAt)
      ) {
        return {
          ...state,
          [action.payload.uuid]: action.payload
        };
      }
      return state;
    }
    case UPSERT_RAW_ITEMS: {
      const newItems = action.payload.reduce((acc: IRawItemsState, curItem) => {
        // filter out new items where the updatedAt is less than what we already have
        const itemExists = state[curItem.uuid];
        if (
          !itemExists ||
          (itemExists && curItem.updatedAt >= itemExists.updatedAt)
        ) {
          acc[curItem.uuid] = curItem;
        }
        return acc;
      }, Object.create(null));

      return {
        ...state,
        ...newItems
      };
    }
    case CLEAR_RAW_ITEM:
      const { [action.payload]: _, ...updatedState } = state;
      return updatedState;
    case CLEAR_RAW_ITEMS:
      return { ...DefaultRawItemsState };
    default:
      return state;
  }
};
