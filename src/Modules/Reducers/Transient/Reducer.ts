import { HANDLE_APP_JUST_LOADED, ITransientAction } from "./Actions";

export interface ITransientState {
  appJustLoaded: boolean;
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
    default:
      return state;
  }
};
