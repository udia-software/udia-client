import {
  ADD_ALERT,
  CLEAR_STATUS,
  CLICKED_ITEM_ID,
  CLICKED_NOTE_ID,
  HANDLE_APP_JUST_LOADED,
  ITransientAction,
  REMOVE_ALERT,
  SET_STATUS
} from "./Actions";

export type StatusType = "loading" | "info" | "error" | "success";

export interface ITransientState {
  appJustLoaded: boolean;
  clickedNoteId?: string;
  clickedItemId?: string;
  alerts: AlertContent[];
  status?: { type: StatusType; content: string };
}

const TransientState: ITransientState = {
  appJustLoaded: true,
  alerts: []
};

export default (
  state: ITransientState = { ...TransientState },
  action: ITransientAction
) => {
  switch (action.type) {
    case HANDLE_APP_JUST_LOADED:
      return {
        ...state,
        appJustLoaded: false
      };
    case CLICKED_ITEM_ID:
      return {
        ...state,
        clickedItemId: action.payload
      };
    case CLICKED_NOTE_ID:
      return {
        ...state,
        clickedNoteId: action.payload
      };
    case ADD_ALERT: {
      const alerts = [action.payload, ...state.alerts].slice(0, 5);
      return {
        ...state,
        alerts
      };
    }
    case REMOVE_ALERT: {
      const alerts = [...state.alerts];
      alerts.splice(action.payload, 1);
      return {
        ...state,
        alerts
      };
    }
    case SET_STATUS:
      return {
        ...state,
        status: action.payload
      };
    case CLEAR_STATUS:
      return {
        ...state,
        status: undefined
      };
    default:
      return state;
  }
};
