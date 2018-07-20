// GraphQL get items response structure for note functionality
declare interface Item {
  uuid: string;
  content: string | null;
  contentType: "note" | null;
  encItemKey: string | null;
  user: Partial<FullUser>;
  parent: Partial<Item> | null;
  children: {
    count: number;
    items: Partial<Item>[];
  };
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
}
