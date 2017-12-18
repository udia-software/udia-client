import { nodeActions } from "./actions";

export const NodeState = {
  title: "",
  content: ""
};

export function nodesReducer(state = { ...NodeState }, { payload, type }) {
  switch (type) {
    case nodeActions.SET_FORM_TITLE:
      return {
        ...state,
        title: payload
      };
    case nodeActions.SET_FORM_CONTENT:
      return {
        ...state,
        content: payload
      };
    default:
      return state;
  }
}
