import {
  ADD_RAW_NOTE,
  ADD_RAW_NOTES,
  CLEAR_NOTES_DATA,
  DELETE_DECRYPTED_NOTE,
  DISCARD_DRAFT,
  INotesAction,
  SET_DECRYPTED_NOTE,
  SET_DRAFT,
  SET_DRAFT_CONTENT,
  SET_DRAFT_TITLE,
  SET_DRAFT_TYPE
} from "./Actions";

const NOTE_TYPE_MARKDOWN = "markdown";
export const NEW_DRAFT_NOTE = "n";
export const EDIT_DRAFT_NOTE = (uuid: string) => `e:${uuid}`;

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
  // custom compare function for ensuring order by createdAt
  const noteIDCompareFunc = (a: string, b: string) => {
    const noteA = state.rawNotes[a] || { createdAt: 0 };
    const noteB = state.rawNotes[b] || { createdAt: 0 };
    // return noteA.createdAt - noteB.createdAt; // old items at beginning, new items at end
    return noteB.createdAt - noteA.createdAt; // new items at beginning, old items at end
  };

  switch (action.type) {
    case SET_DRAFT: {
      const { draftId, note } = action.payload;
      const drafts = {
        ...state.drafts,
        [draftId]: note
      };
      return {
        ...state,
        drafts
      };
    }
    case SET_DRAFT_TITLE: {
      const { draftId, title } = action.payload;
      const drafts = {
        ...state.drafts,
        [draftId]: {
          content: "",
          noteType: NOTE_TYPE_MARKDOWN,
          ...state.drafts[draftId],
          title
        }
      };
      return {
        ...state,
        drafts
      };
    }
    case SET_DRAFT_CONTENT: {
      const { draftId, content } = action.payload;
      const drafts = {
        ...state.drafts,
        [draftId]: {
          title: "",
          noteType: NOTE_TYPE_MARKDOWN,
          ...state.drafts[draftId],
          content
        }
      };
      return {
        ...state,
        drafts
      };
    }
    case SET_DRAFT_TYPE: {
      const { draftId, type } = action.payload;
      return {
        ...state,
        drafts: {
          ...state.drafts,
          [draftId]: {
            title: "",
            content: "",
            ...state.drafts[draftId],
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
      const rawNotes: { [index: string]: Item } = {
        ...state.rawNotes,
        ...action.payload.reduce((map: typeof state.rawNotes, rawNoteItem) => {
          map[rawNoteItem.uuid] = rawNoteItem;
          return map;
        }, {})
      };
      const noteIDs = Array.from(
        new Set([
          ...state.noteIDs,
          ...action.payload.map(noteItem => noteItem.uuid)
        ])
      );
      noteIDs
        .filter(id => {
          const item = rawNotes[id];
          return item && !item.deleted;
        })
        .sort(noteIDCompareFunc);
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
      const noteIDs = Array.from(new Set([...state.noteIDs, newUUID]));
      noteIDs
        .filter(id => {
          const item = rawNotes[id];
          return item && !item.deleted;
        })
        .sort(noteIDCompareFunc);
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
    case DELETE_DECRYPTED_NOTE: {
      const decryptedNotes = {
        ...state.decryptedNotes
      };
      delete decryptedNotes[action.payload];
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
