import {
  CLEAR_NOTES_DATA,
  DISCARD_DRAFT,
  INotesAction,
  SET_DRAFT_CONTENT,
  SET_DRAFT_ID,
  SET_DRAFT_TITLE,
  SET_DRAFT_TYPE
} from "./Actions";

export const NEW_DRAFT_NOTE = "n";
export const NOTE_TYPE_TEXT = "text";
export const NOTE_TYPE_MARKDOWN = "markdown";
export type NoteType = typeof NOTE_TYPE_TEXT | typeof NOTE_TYPE_MARKDOWN;

export interface IDraftNote {
  itemId?: string; // undefined if this is a new note
  title: string;
  content: string;
  noteType: NoteType;
}

export interface INotesState {
  drafts: {
    [index: string]: IDraftNote; // `n` new (root), `e:${id}` editing, `p:${id}` new (nested);
  };
}

const DefaultNotesState: INotesState = {
  drafts: {}
};

export default (
  state: INotesState = { ...DefaultNotesState },
  action: INotesAction
) => {
  switch (action.type) {
    case SET_DRAFT_ID: {
      const { parentId, id } = action.payload;
      const drafts = {
        ...state.drafts,
        [parentId]: {
          title: "",
          content: "",
          type: NOTE_TYPE_MARKDOWN,
          ...state.drafts[parentId],
          itemId: id
        }
      };
      return {
        ...state,
        drafts
      };
    }
    case SET_DRAFT_TITLE: {
      const { parentId, title } = action.payload;
      const drafts = {
        ...state.drafts,
        [parentId]: {
          content: "",
          noteType: NOTE_TYPE_MARKDOWN,
          ...state.drafts[parentId],
          title
        }
      };
      return {
        ...state,
        drafts
      };
    }
    case SET_DRAFT_CONTENT: {
      const { parentId, content } = action.payload;
      const drafts = {
        ...state.drafts,
        [parentId]: {
          title: "",
          noteType: NOTE_TYPE_MARKDOWN,
          ...state.drafts[parentId],
          content
        }
      };
      return {
        ...state,
        drafts
      };
    }
    case SET_DRAFT_TYPE: {
      const { parentId, type } = action.payload;
      return {
        ...state,
        drafts: {
          ...state.drafts,
          [parentId]: {
            title: "",
            content: "",
            ...state.drafts[parentId],
            noteType: type
          }
        }
      };
    }
    case DISCARD_DRAFT: {
      const drafts = { ...state.drafts };
      delete drafts[action.payload];
      return {
        ...state,
        drafts
      };
    }
    case CLEAR_NOTES_DATA: {
      return {
        ...DefaultNotesState
      };
    }
    default:
      return {
        ...state,
        drafts: { ...state.drafts }
      };
  }
};
