import {
  CLEAR_NOTES_DATA,
  INotesAction,
  SET_DRAFT_CONTENT,
  SET_DRAFT_ID,
  SET_DRAFT_TITLE,
  SET_DRAFT_TYPE
} from "./Actions";

export interface IDraftNote {
  itemId?: string; // undefined if this is a new note
  title: string;
  content: string;
  noteType: "text" | "markdown";
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
          type: "markdown",
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
          noteType: "markdown",
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
          noteType: "markdown",
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
            type
          }
        }
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
