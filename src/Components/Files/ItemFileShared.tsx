import gql from "graphql-tag";
import React from "react";
import { IDraftItemsState } from "../../Modules/Reducers/DraftItems/Reducer";
import { IProcessedItemsState } from "../../Modules/Reducers/ProcessedItems/Reducer";
import { IRawItemsState } from "../../Modules/Reducers/RawItems/Reducer";
import { IStructureState } from "../../Modules/Reducers/Structure/Reducer";
import styled from "../AppStyles";
import GridTemplateLoadingOverlay from "../Helpers/GridTemplateLoadingOverlay";
import UdiaStatement from "../Helpers/StatementGenerator";
import DraftEditorController from "./DraftEditorController";
import RawItemEditorController from "./RawItemEditorController";

// Find or initialize a draft by user given draft id
export const findOrInitDraft = (
  user: FullUser,
  lookupDraftId: string = "",
  processedItems: IProcessedItemsState,
  draftItems: IDraftItemsState,
  structure: IStructureState
): { draftId: string; draft: DraftItemPayload } => {
  let parentId = user.username;

  // Editing an existing item
  if (lookupDraftId) {
    // Check if a draft already exists, if so return the draft
    for (const draftedAt of Object.keys(draftItems)) {
      const draft = draftItems[draftedAt];
      if (
        draft &&
        (draft.uuid === lookupDraftId || draftedAt === lookupDraftId)
      ) {
        return { draftId: draftedAt, draft };
      }
    }

    const processedItem = processedItems[lookupDraftId];
    // Find the parent of the item (defaults to username)
    for (const dirId of Object.keys(structure)) {
      const itemIds = structure[dirId];
      if (lookupDraftId in itemIds) {
        parentId = dirId;
      }
    }
    if (processedItem && processedItem.contentType === "note") {
      return {
        draftId: `${Date.now()}`,
        draft: {
          contentType: processedItem.contentType,
          draftContent: processedItem.processedContent,
          parentId,
          uuid: lookupDraftId
        }
      };
    }
  }
  // Not editing. Probably creating a new item (or fallback edit item not found)
  return {
    draftId: `${Date.now()}`,
    draft: {
      contentType: "note",
      draftContent: {
        title: "",
        content: "",
        noteType: "markdown"
      },
      parentId
    }
  };
};

export const EditItemTitle = styled.textarea`
  background: transparent;
  font-family: monospace;
  color: ${props => props.theme.primaryColor};
  border: 0px;
  padding: 0;
  margin: 0;
  font-size: 2em;
  height: auto;
  width: 100%;
`;

const IterimContentState = styled.div`
  display: grid;
  place-content: center;
  grid-template-areas: "iterim-content";
  width: 100%;
  height: 100%;
`;

const NoContentComponent =  () =>(
  <IterimContentState>
    <GridTemplateLoadingOverlay
      gridAreaName="interim-content"
      loading={true}
      loadingText={UdiaStatement()}
    />
  </IterimContentState>
);

export const determineContentViewer = (
  id: string | undefined,
  processedItems: IProcessedItemsState,
  draftItems: IDraftItemsState,
  rawItems: IRawItemsState
) => {
  if (typeof id !== "undefined") {
    if (id in processedItems) {
      const pip = processedItems[id];
      switch (pip.contentType) {
        case "note":
          return <DraftEditorController itemOrDraftId={id} />;
        case "directory":
          // return <span>TODO: DIR PROCESSED</span>;
          return <NoContentComponent />;
        case null:
          return <RawItemEditorController itemId={id} />;
      }
    }
    if (id in draftItems) {
      const dip = draftItems[id];
      switch (dip.contentType) {
        case "note":
          return <DraftEditorController itemOrDraftId={id} />;
        case "directory":
          return <DraftEditorController itemOrDraftId={id} />;
      }
    }
    if (id in rawItems) {
      return <RawItemEditorController itemId={id} />;
    }
  }
  return <NoContentComponent />;
};

export const GET_ITEMS_QUERY = gql`
  query GetItemsQuery($params: ItemPaginationInput) {
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
  query GetItemQuery($id: ID!) {
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
  mutation DeleteItemMutation($id: ID!) {
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
