import { StatusType } from "./Reducer";

export const HANDLE_APP_JUST_LOADED = "transient/HANDLE_APP_JUST_LOADED";
export const CLICKED_NOTE_ID = "transient/CLICKED_NOTE_ID";
export const CLICKED_ITEM_ID = "transient/CLICKED_ITEM_ID";
export const ADD_ALERT = "transient/ADD_ALERT";
export const REMOVE_ALERT = "transient/REMOVE_ALERT";
export const SET_STATUS = "transient/SET_STATUS";
export const CLEAR_STATUS = "transient/CLEAR_STATUS";

export interface IHandleAppJustLoadedAction {
  type: typeof HANDLE_APP_JUST_LOADED;
}

export interface IClickedNoteIdAction {
  type: typeof CLICKED_NOTE_ID;
  payload: string;
}

export interface IClickedItemIdAction {
  type: typeof CLICKED_ITEM_ID;
  payload: string;
}

export interface IAddAlertAction {
  type: typeof ADD_ALERT;
  payload: AlertContent;
}

export interface IRemoveAlertAction {
  type: typeof REMOVE_ALERT;
  payload: number;
}

export interface ISetStatusAction {
  type: typeof SET_STATUS;
  payload: {
    type: StatusType;
    content: string;
  };
}

export interface IClearStatusAction {
  type: typeof CLEAR_STATUS;
}

export type ITransientAction =
  | IHandleAppJustLoadedAction
  | IClickedNoteIdAction
  | IClickedItemIdAction
  | IAddAlertAction
  | IRemoveAlertAction
  | ISetStatusAction
  | IClearStatusAction;

export const handleAppJustLoaded = (): IHandleAppJustLoadedAction => ({
  type: HANDLE_APP_JUST_LOADED
});

export const setClickedNoteId = (uuid: string): IClickedNoteIdAction => ({
  type: CLICKED_NOTE_ID,
  payload: uuid
});

export const setClickedItemId = (uuid: string): IClickedItemIdAction => ({
  type: CLICKED_ITEM_ID,
  payload: uuid
});

export const addAlert = (alertContent: AlertContent): IAddAlertAction => ({
  type: ADD_ALERT,
  payload: alertContent
});

export const removeAlert = (index: number): IRemoveAlertAction => ({
  type: REMOVE_ALERT,
  payload: index
});

export const setStatus = (
  type: StatusType,
  content: string
): ISetStatusAction => ({
  type: SET_STATUS,
  payload: {
    type,
    content
  }
});

export const clearStatus = (): IClearStatusAction => ({
  type: CLEAR_STATUS
});
