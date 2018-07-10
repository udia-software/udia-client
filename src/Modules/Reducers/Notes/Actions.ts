// Action serializable and unique type strings
export const SET_DRAFT_ID = "notes/SET_DRAFT_ID";
export const SET_DRAFT_TITLE = "notes/SET_DRAFT_TITLE";
export const SET_DRAFT_CONTENT = "notes/SET_DRAFT_CONTENT";
export const SET_DRAFT_TYPE = "notes/SET_DRAFT_TYPE";
export const DISCARD_DRAFT = "notes/DISCARD_DRAFT";
export const ADD_RAW_NOTES = "notes/ADD_RAW_NOTES";
export const ADD_RAW_NOTE = "notes/ADD_RAW_NOTE";
export const DELETE_RAW_NOTE = "notes/DELETE_RAW_NOTE";
export const CLEAR_NOTES_DATA = "notes/CLEAR_NOTES_DATA";

/**
 * DRAFTING NOTE ACTIONS
 */
export interface ISetDraftNoteIDAction {
  type: typeof SET_DRAFT_ID;
  payload: {
    parentId: string;
    id: string;
  };
}
export const setDraftNoteID = (
  parentId: string,
  id: string
): ISetDraftNoteIDAction => ({
  type: SET_DRAFT_ID,
  payload: {
    parentId,
    id
  }
});

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
  payload: NoteItem[];
}
export const addRawNotes = (noteItems: NoteItem[]) => ({
  type: ADD_RAW_NOTES,
  payload: noteItems
});

export interface IAddRawNoteAction {
  type: typeof ADD_RAW_NOTE;
  payload: NoteItem;
}
export const addRawNote = (noteItem: NoteItem) => ({
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
 * CLEAR STATE ACTION
 */

export interface IClearNotesDataAction {
  type: typeof CLEAR_NOTES_DATA;
}
export const clearNotesData = (): IClearNotesDataAction => ({
  type: CLEAR_NOTES_DATA
});

export type INotesAction =
  | ISetDraftNoteIDAction
  | ISetDraftNoteTitleAction
  | ISetDraftNoteContentAction
  | ISetDraftNoteTypeAction
  | IDiscardDraftNoteAction
  | IAddRawNotesAction
  | IAddRawNoteAction
  | IDeleteRawNoteAction
  | IClearNotesDataAction;
