// Action serializable and unique type strings
export const SET_DRAFT_TITLE = "notes/SET_DRAFT_TITLE";
export const SET_DRAFT_CONTENT = "notes/SET_DRAFT_CONTENT";
export const SET_DRAFT_TYPE = "notes/SET_DRAFT_TYPE";
export const DISCARD_DRAFT = "notes/DISCARD_DRAFT";
export const ADD_RAW_NOTES = "notes/ADD_RAW_NOTES";
export const ADD_RAW_NOTE = "notes/ADD_RAW_NOTE";
export const DELETE_RAW_NOTE = "notes/DELETE_RAW_NOTE";
export const SET_DECRYPTED_NOTE = "notes/ADD_DECRYPTED_NOTE";
export const CLEAR_NOTES_DATA = "notes/CLEAR_NOTES_DATA";

/**
 * DRAFTING NOTE ACTIONS
 */
export interface ISetDraftNoteTitleAction {
  type: typeof SET_DRAFT_TITLE;
  payload: {
    parentId: string;
    title: string;
  };
}
export const setDraftNoteTitle = (
  parentId: string,
  title: string
): ISetDraftNoteTitleAction => ({
  type: SET_DRAFT_TITLE,
  payload: {
    parentId,
    title
  }
});

export interface ISetDraftNoteContentAction {
  type: typeof SET_DRAFT_CONTENT;
  payload: {
    parentId: string;
    content: string;
  };
}
export const setDraftNoteContent = (
  parentId: string,
  content: string
): ISetDraftNoteContentAction => ({
  type: SET_DRAFT_CONTENT,
  payload: {
    parentId,
    content
  }
});

export interface ISetDraftNoteTypeAction {
  type: typeof SET_DRAFT_TYPE;
  payload: {
    parentId: string;
    type: "text" | "markdown";
  };
}
export const setDraftNoteType = (
  parentId: string,
  type: "text" | "markdown"
): ISetDraftNoteTypeAction => ({
  type: SET_DRAFT_TYPE,
  payload: {
    parentId,
    type
  }
});

export interface IDiscardDraftNoteAction {
  type: typeof DISCARD_DRAFT;
  payload: string;
}
export const discardDraft = (parentId: string): IDiscardDraftNoteAction => ({
  type: DISCARD_DRAFT,
  payload: parentId
});

/**
 * PERSIST RAW NOTE-ITEMS ACTIONS
 */
export interface IAddRawNotesAction {
  type: typeof ADD_RAW_NOTES;
  payload: Item[];
}
export const addRawNotes = (noteItems: Item[]) => ({
  type: ADD_RAW_NOTES,
  payload: noteItems
});

export interface IAddRawNoteAction {
  type: typeof ADD_RAW_NOTE;
  payload: Item;
}
export const addRawNote = (noteItem: Item) => ({
  type: ADD_RAW_NOTE,
  payload: noteItem
});

export interface IDeleteRawNoteAction {
  type: typeof DELETE_RAW_NOTE;
  payload: string;
}
export const deleteRawNote = (uuid: string) => ({
  type: DELETE_RAW_NOTE,
  payload: uuid
});

/**
 * PERSIST DECRYPTED NOTE-ITEM ACTIONS
 */
export interface ISetDecryptedNoteAction {
  type: typeof SET_DECRYPTED_NOTE;
  payload: {
    uuid: string;
    decryptedAt: number;
    decryptedNote: DecryptedNote;
  };
}
export const setDecryptedNote = (
  uuid: string,
  decryptedAt: number,
  decryptedNote: DecryptedNote
) => ({
  type: SET_DECRYPTED_NOTE,
  payload: { uuid, decryptedAt, decryptedNote }
});

/**
 * CLEAR STATE ACTION
 */
export interface IClearNotesDataAction {
  type: typeof CLEAR_NOTES_DATA;
}
export const clearNotesData = (): IClearNotesDataAction => ({
  type: CLEAR_NOTES_DATA
});

export type INotesAction =
  | ISetDraftNoteTitleAction
  | ISetDraftNoteContentAction
  | ISetDraftNoteTypeAction
  | IDiscardDraftNoteAction
  | IAddRawNotesAction
  | IAddRawNoteAction
  | IDeleteRawNoteAction
  | ISetDecryptedNoteAction
  | IClearNotesDataAction;
