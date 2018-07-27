declare interface DecryptedDirectory {
  dirName: string;
}

declare interface DecryptedNote {
  title: string;
  content: string;
  noteType: "text" | "markdown";
}

declare type DecryptedItemPayload = DecryptedDirectory | DecryptedNote;
