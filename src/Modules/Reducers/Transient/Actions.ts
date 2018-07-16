export const HANDLE_APP_JUST_LOADED = "transient/HANDLE_APP_JUST_LOADED";
export const CLICKED_NOTE_ID = "transient/CLICKED_NOTE_ID";

export interface IHandleAppJustLoaded {
  type: typeof HANDLE_APP_JUST_LOADED;
}

export interface IClickedNoteId {
  type: typeof CLICKED_NOTE_ID;
  payload: string;
}

export type ITransientAction = IHandleAppJustLoaded | IClickedNoteId;

export const handleAppJustLoaded = (): IHandleAppJustLoaded => ({
  type: HANDLE_APP_JUST_LOADED
});

export const setClickedNoteId = (uuid: string): IClickedNoteId => ({
  type: CLICKED_NOTE_ID,
  payload: uuid
});
