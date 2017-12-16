import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { authReducer } from "./auth";
import { nodesReducer } from "./nodes";

export default combineReducers({
  routing: routerReducer,
  auth: authReducer,
  nodes: nodesReducer
});
