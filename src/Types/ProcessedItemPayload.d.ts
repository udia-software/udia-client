interface BaseProcessedItemPayload {
  contentType: string | null;
  processedAt: number;
  processedContent: any;
  errors?: string[];
}

declare interface ProcessedNotePayload extends BaseProcessedItemPayload {
  contentType: "note";
  processedContent: DecryptedNote;
}

declare interface ProcessedDirectoryPayload extends BaseProcessedItemPayload {
  contentType: "directory";
  processedContent: DecryptedDirectory;
}

declare interface ProcessedErrorPayload extends BaseProcessedItemPayload {
  contentType: null;
  processedContent: null;
}

declare type ProcessedItemPayload =
  | ProcessedNotePayload
  | ProcessedDirectoryPayload
  | ProcessedErrorPayload;
