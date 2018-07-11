import { IRootState } from "../../ConfigureReduxStore";
import { NEW_DRAFT_NOTE } from "./Reducer";

/**
 * Return boolean indicating if a new note is being created/drafted
 */
export const isDraftingNewNote = ({ notes }: IRootState) => {
  const draftNote = notes.drafts[NEW_DRAFT_NOTE];
  if (draftNote) {
    return !!draftNote.title || !!draftNote.content;
  }
  return false;
};
