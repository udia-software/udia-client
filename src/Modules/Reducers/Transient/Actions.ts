export const HANDLE_APP_JUST_LOADED = "transient/HANDLE_APP_JUST_LOADED";
export const CLICKED_NOTE_ID = "transient/CLICKED_NOTE_ID";
export const ADD_ALERT = "transient/ADD_ALERT";
export const REMOVE_ALERT = "transient/REMOVE_ALERT";

export interface IHandleAppJustLoaded {
  type: typeof HANDLE_APP_JUST_LOADED;
}

export interface IClickedNoteId {
  type: typeof CLICKED_NOTE_ID;
  payload: string;
}

export interface IAddAlert {
  type: typeof ADD_ALERT;
  payload: AlertContent;
}

export interface IRemoveAlert {
  type: typeof REMOVE_ALERT;
  payload: number;
}

export type ITransientAction =
  | IHandleAppJustLoaded
  | IClickedNoteId
  | IAddAlert
  | IRemoveAlert;

export const handleAppJustLoaded = (): IHandleAppJustLoaded => ({
  type: HANDLE_APP_JUST_LOADED
});

export const setClickedNoteId = (uuid: string): IClickedNoteId => ({
  type: CLICKED_NOTE_ID,
  payload: uuid
});

export const addAlert = (alertContent: AlertContent): IAddAlert => ({
  type: ADD_ALERT,
  payload: alertContent
});

export const removeAlert = (index: number): IRemoveAlert => ({
  type: REMOVE_ALERT,
  payload: index
})