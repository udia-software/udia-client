// Action serializable and unique type strings
export const SET_DRAFT_ID = "notes/SET_DRAFT_ID";
export const SET_DRAFT_TITLE = "notes/SET_DRAFT_TITLE";
export const SET_DRAFT_CONTENT = "notes/SET_DRAFT_CONTENT";
export const SET_DRAFT_TYPE = "notes/SET_DRAFT_TYPE";
export const CLEAR_NOTES_DATA = "notes/CLEAR_NOTES_DATA";

// Action interfaces
export interface ISetDraftNoteIDAction {
  type: typeof SET_DRAFT_ID;
  payload: {
    parentId: string;
    id: string;
  };
}

export interface ISetDraftNoteTitleAction {
  type: typeof SET_DRAFT_TITLE;
  payload: {
    parentId: string;
    title: string;
  };
}

export interface ISetDraftNoteContentAction {
  type: typeof SET_DRAFT_CONTENT;
  payload: {
    parentId: string;
    content: string;
  };
}

export interface ISetDraftNoteTypeAction {
  type: typeof SET_DRAFT_TYPE;
  payload: {
    parentId: string;
    type: "text" | "markdown";
  };
}

export interface IClearNotesDataAction {
  type: typeof CLEAR_NOTES_DATA;
}

export type INotesAction =
  | ISetDraftNoteIDAction
  | ISetDraftNoteTitleAction
  | ISetDraftNoteContentAction
  | ISetDraftNoteTypeAction
  | IClearNotesDataAction;

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

export const clearNotesData = (): IClearNotesDataAction => ({
  type: CLEAR_NOTES_DATA
});
