declare interface ProcessedItemPayload {
  processedAt: number;
  processedContent: DecryptedNote | null;
  errors?: string[];
}
