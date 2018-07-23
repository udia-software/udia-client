interface BaseDraftItemPayload {
  contentType: string;
  draftContent: any;
  parentId: string; // determines draft item heiarchy
  uuid?: string; // if set, indicates an edit of existing item, otherwise new draft
  errors?: string[];
}

declare interface DraftNotePayload extends BaseDraftItemPayload {
  contentType: "note";
  draftContent: DecryptedNote;
  parentId: string;
  uuid?: string;
  errors?: string[];
}

declare interface DraftDirectoryPayload extends BaseDraftItemPayload {
  contentType: "directory";
  draftContent: DecryptedDirectory;
  parentId: string;
  uuid?: string;
  errors?: string[];
}

declare type DraftItemPayload = 
  | DraftNotePayload
  | DraftDirectoryPayload;
