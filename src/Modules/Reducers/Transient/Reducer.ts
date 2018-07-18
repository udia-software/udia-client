import {
  ADD_ALERT,
  CLICKED_NOTE_ID,
  HANDLE_APP_JUST_LOADED,
  ITransientAction,
  REMOVE_ALERT
} from "./Actions";

export interface ITransientState {
  appJustLoaded: boolean;
  clickedNoteId?: string;
  alerts: AlertContent[];
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
    default:
      return state;
  }
};
