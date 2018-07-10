// GraphQL get items response structure for note functionality
declare interface NoteItem {
  uuid: string;
  content: string;
  contentType: string;
  encItemKey?: string;
  user: {
    uuid: string;
    username: string;
    pubVerifyKey: string;
  };
  parent: {
    uuid: string;
  };
  children: {
    count: number;
    items: [{ uuid: string }];
  };
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
}
