import gql from "graphql-tag";

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
