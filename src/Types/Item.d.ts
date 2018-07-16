// GraphQL get items response structure for note functionality
declare interface Item {
  uuid: string;
  content: string | null;
  contentType: string | null;
  encItemKey?: string | null;
  user: {
    uuid: string;
    username: string;
    pubVerifyKey: string;
  };
  parent: {
    uuid: string;
  } | null;
  children: {
    count: number;
    items: [{ uuid: string }];
  };
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
}
