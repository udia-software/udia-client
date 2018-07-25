import gql from "graphql-tag";
import React from "react";
import { IDraftItemsState } from "../../Modules/Reducers/DraftItems/Reducer";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import NoteFileEditorController from "./NoteFileEditorController";
import RawItemEditorController from "./RawItemEditorController";

export const determineContentViewer = (
  id: string | undefined,
  processedItems: IProcessedItemsState,
  draftItems: IDraftItemsState,
  rawItems: IRawItemsState
) => {
  if (id) {
    if (id in processedItems) {
      const pip = processedItems[id];
      switch (pip.contentType) {
        case "note":
          return <NoteFileEditorController editItemId={id} />;
        case "directory":
          return <span>TODO: DIR</span>;
        case null:
          return <RawItemEditorController itemId={id} />;
      }
    }
    if (id in draftItems) {
      const dip = draftItems[id];
      switch (dip.contentType) {
        case "note":
          return <NoteFileEditorController editItemId={id} />;
        case "directory":
          return <span>TODO: DIR</span>;
      }
    }
    if (id in rawItems) {
      return <RawItemEditorController itemId={id} />;
    }
  }
  return <NoteFileEditorController />;
};

export const GET_ITEMS_QUERY = gql`
  query GetItemsQuery(
    $params: ItemPaginationInput
    $childrenParams: ItemPaginationInput
  ) {
    getItems(params: $params) {
      count
      items {
        uuid
        content
        contentType
        encItemKey
        user {
          uuid
          username
          pubVerifyKey
        }
        deleted
        parent {
          uuid
        }
        children(params: $childrenParams) {
          count
          items {
            uuid
          }
        }
        createdAt
        updatedAt
      }
    }
  }
`;
export interface IGetItemsParams {
  username: string; // Filter items by username (or null for orphaned by deleted user)
  parentId: string; // Filter items by parentID (or null for root)
  depth: number; // Filter items by depth in relation to parentId
  contentTypeIn: string[]; // Filter items with item content type
  limit: number; // Maximum number of items returned from query (Hard cap 32)
  showDeleted: boolean; // Should we return deleted items? (only not deleted items if not set)
  datetime: Date | number; // Datetime for keyset pagination
  sort: "createdAt" | "updatedAt"; // pretty much always leave this as createdAt
  order: "DESC" | "ASC"; // Order items Pby? (Defaults to DESC)
}
export interface IGetItemsResponseData {
  getItems: {
    count: number;
    items: Item[];
  };
}

export const GET_ITEM_QUERY = gql`
  query GetItemQuery($id: ID!, $childrenParams: ItemPaginationInput) {
    getItem(id: $id) {
      uuid
      content
      contentType
      encItemKey
      user {
        uuid
        username
        pubVerifyKey
      }
      deleted
      parent {
        uuid
      }
      children(params: $childrenParams) {
        count
        items {
          uuid
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export interface IGetItemResponseData {
  getItem: Item;
}

export const CREATE_ITEM_MUTATION = gql`
  mutation CreateItemMutation($params: CreateItemInput!) {
    createItem(params: $params) {
      uuid
      content
      contentType
      encItemKey
      user {
        uuid
        username
        pubVerifyKey
      }
      deleted
      parent {
        uuid
      }
      children {
        count
        items {
          uuid
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export interface ICreateItemInputParams {
  content: string;
  contentType: string;
  encItemKey?: string;
  parentId?: string;
}
export interface ICreateItemMutationResponse {
  createItem: Item;
}

export const UPDATE_ITEM_MUTATION = gql`
  mutation UpdateItemMutation($id: ID!, $params: UpdateItemInput!) {
    updateItem(id: $id, params: $params) {
      uuid
      content
      contentType
      encItemKey
      user {
        uuid
        username
        pubVerifyKey
      }
      deleted
      parent {
        uuid
      }
      children {
        count
        items {
          uuid
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export interface IUpdateItemInput {
  content?: string;
  contentType?: string;
  encItemKey?: string;
  parentId?: string;
}
export interface IUpdateItemMutationResponse {
  updateItem: Item;
}

export const DELETE_ITEM_MUTATION = gql`
  mutation DeleteItemMutation($id: ID!, $childrenParams: ItemPaginationInput) {
    deleteItem(id: $id) {
      uuid
      content
      contentType
      encItemKey
      user {
        uuid
        username
        pubVerifyKey
      }
      deleted
      parent {
        uuid
      }
      children(params: $childrenParams) {
        count
        items {
          uuid
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export interface IDeleteItemResponseData {
  deleteItem: Item;
}

export const ITEM_SUBSCRIPTION = gql`
  subscription ItemSubscription($params: ItemSubscriptionInput!) {
    itemSubscription(params: $params) {
      uuid
      type
      timestamp
      meta
    }
  }
`;
export interface IItemSubscriptionParams {
  ancestorId?: string;
  parentId?: string;
  userId?: string;
}
export interface IItemSubscriptionPayload {
  itemSubscription: {
    uuid: string;
    type: "ITEM_CREATED" | "ITEM_UPDATED" | "ITEM_DELETED";
    timestamp: number;
    meta: string | null;
  };
}
