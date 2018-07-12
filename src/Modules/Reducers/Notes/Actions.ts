// Action serializable and unique type strings
export const SET_DRAFT = "notes/SET_DRAFT";
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
export interface ISetDraftAction {
  type: typeof SET_DRAFT;
  payload: { draftId: string; note: DecryptedNote };
}
export const setDraft = (draftId: string, note: DecryptedNote) => ({
  type: SET_DRAFT,
  payload: { draftId, note }
});

export interface ISetDraftNoteTitleAction {
  type: typeof SET_DRAFT_TITLE;
  payload: {
    draftId: string;
    title: string;
  };
}
export const setDraftNoteTitle = (
  draftId: string,
  title: string
): ISetDraftNoteTitleAction => ({
  type: SET_DRAFT_TITLE,
  payload: {
    draftId,
    title
  }
});

export interface ISetDraftNoteContentAction {
  type: typeof SET_DRAFT_CONTENT;
  payload: {
    draftId: string;
    content: string;
  };
}
export const setDraftNoteContent = (
  draftId: string,
  content: string
): ISetDraftNoteContentAction => ({
  type: SET_DRAFT_CONTENT,
  payload: {
    draftId,
    content
  }
});

export interface ISetDraftNoteTypeAction {
  type: typeof SET_DRAFT_TYPE;
  payload: {
    draftId: string;
    type: "text" | "markdown";
  };
}
export const setDraftNoteType = (
  draftId: string,
  type: "text" | "markdown"
): ISetDraftNoteTypeAction => ({
  type: SET_DRAFT_TYPE,
  payload: {
    draftId,
    type
  }
});

export interface IDiscardDraftNoteAction {
  type: typeof DISCARD_DRAFT;
  payload: string;
}
export const discardDraft = (draftId: string): IDiscardDraftNoteAction => ({
  type: DISCARD_DRAFT,
  payload: draftId
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
    decryptedNote: DecryptedNote | null;
    errors?: string[];
  };
}
export const setDecryptedNote = (
  uuid: string,
  decryptedAt: number,
  decryptedNote: DecryptedNote | null,
  errors?: string[]
) => ({
  type: SET_DECRYPTED_NOTE,
  payload: { uuid, decryptedAt, decryptedNote, errors }
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
  | ISetDraftAction
  | ISetDraftNoteTitleAction
  | ISetDraftNoteContentAction
  | ISetDraftNoteTypeAction
  | IDiscardDraftNoteAction
  | IAddRawNotesAction
  | IAddRawNoteAction
  | IDeleteRawNoteAction
  | ISetDecryptedNoteAction
  | IClearNotesDataAction;
