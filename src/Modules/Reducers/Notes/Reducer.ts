import {
  ADD_RAW_NOTE,
  ADD_RAW_NOTES,
  CLEAR_NOTES_DATA,
  DELETE_RAW_NOTE,
  DISCARD_DRAFT,
  INotesAction,
  SET_DECRYPTED_NOTE,
  SET_DRAFT_CONTENT,
  SET_DRAFT_TITLE,
  SET_DRAFT_TYPE
} from "./Actions";

const NOTE_TYPE_MARKDOWN = "markdown";
export const NEW_DRAFT_NOTE = "n";

export interface INotesState {
  // dictionary of draft notes
  drafts: {
    [index: string]: DecryptedNote; // `n` new (root), `e:${id}` editing, `p:${id}` new (nested);
  };
  // dictionary of raw notes
  rawNotes: {
    [index: string]: Item; // reference by item uuid
  };
  decryptedNotes: {
    [index: string]: {
      decryptedAt: number; // millisecond time
      decryptedNote: DecryptedNote | null;
      errors?: string[];
    };
  };
  // array of UUIDs for determining order
  noteIDs: string[];
}

const DefaultNotesState: INotesState = {
  drafts: {},
  rawNotes: {},
  noteIDs: [],
  decryptedNotes: {}
};

export default (
  state: INotesState = { ...DefaultNotesState },
  action: INotesAction
) => {
  switch (action.type) {
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
    case ADD_RAW_NOTES: {
      const rawNotes = {
        ...state.rawNotes,
        ...action.payload.reduce((map: typeof state.rawNotes, rawNoteItem) => {
          map[rawNoteItem.uuid] = rawNoteItem;
          return map;
        }, {})
      };
      const noteIDs = [
        ...state.noteIDs,
        ...action.payload.map(noteItem => noteItem.uuid)
      ].reduce(
        // removes potential duplicates and preserves order of array
        (accum: typeof state.noteIDs, current) => {
          if (accum.indexOf(current) < 0) {
            accum.push(current);
          }
          return accum;
        },
        []
      );
      return {
        ...state,
        rawNotes,
        noteIDs
      };
    }
    case ADD_RAW_NOTE: {
      const newUUID = action.payload.uuid;
      const rawNotes = {
        ...state.rawNotes,
        [newUUID]: action.payload
      };
      let noteIDs = [...state.noteIDs];
      if (noteIDs.indexOf(newUUID) < 0) {
        noteIDs = [newUUID, ...state.noteIDs];
      }
      return {
        ...state,
        rawNotes,
        noteIDs
      };
    }
    case DELETE_RAW_NOTE: {
      const noteIDs = [...state.noteIDs];
      const rawNotes = { ...state.rawNotes };
      delete rawNotes[action.payload];
      const idx = noteIDs.indexOf(action.payload);
      if (idx > -1) {
        noteIDs.splice(idx, 1);
      }
      return {
        ...state,
        rawNotes,
        noteIDs
      };
    }
    case SET_DECRYPTED_NOTE: {
      const { uuid, decryptedAt, decryptedNote, errors } = action.payload;
      const decryptedNotes = {
        ...state.decryptedNotes,
        [uuid]: {
          decryptedAt,
          decryptedNote,
          errors
        }
      };
      return {
        ...state,
        decryptedNotes
      };
    }
    case CLEAR_NOTES_DATA: {
      return {
        ...DefaultNotesState
      };
    }
    default: {
      return {
        ...state,
        drafts: { ...state.drafts }
      };
    }
  }
};
