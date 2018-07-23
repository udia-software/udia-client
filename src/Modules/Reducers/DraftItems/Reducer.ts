import {
  CLEAR_DRAFT_ITEM,
  CLEAR_DRAFT_ITEMS,
  IDraftItemsAction,
  UPSERT_DRAFT_ITEM
} from "./Actions";

export interface IDraftItemsState {
  [createdAt: string]: DraftItemPayload;
}

const DefaultProcessedItemsState = Object.create(null);

export default (
  state: IDraftItemsState = DefaultProcessedItemsState,
  action: IDraftItemsAction
) => {
  switch (action.type) {
    case UPSERT_DRAFT_ITEM: {
      const {
        createdAt,
        contentType,
        draftContent,
        parentId,
        uuid,
        errors
      } = action.payload;
      return {
        ...state,
        [createdAt]: { contentType, draftContent, parentId, uuid, errors }
      };
    }
    case CLEAR_DRAFT_ITEM: {
      const { [action.payload]: _, ...updatedState } = state;
      return updatedState;
    }
    case CLEAR_DRAFT_ITEMS: {
      return { ...DefaultProcessedItemsState };
    }
    default:
      return state;
  }
};
