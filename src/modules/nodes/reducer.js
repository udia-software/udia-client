import { Record } from "immutable";
import { nodeActions } from "./actions";

export const NodeState = new Record({
  title: "",
  content: ""
});

export function nodesReducer(state = new NodeState(), { payload, type }) {
  switch (type) {
    case nodeActions.SET_FORM_TITLE:
      return state.merge({
        title: payload
      });
    case nodeActions.SET_FORM_CONTENT:
      return state.merge({
        content: payload
      });
    default:
      return state;
  }
}
