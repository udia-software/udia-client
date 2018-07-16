import {
  CLICKED_NOTE_ID,
  HANDLE_APP_JUST_LOADED,
  ITransientAction
} from "./Actions";

export interface ITransientState {
  appJustLoaded: boolean;
  clickedNoteId?: string;
}

const TransientState: ITransientState = {
  appJustLoaded: true
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
    default:
      return state;
  }
};
