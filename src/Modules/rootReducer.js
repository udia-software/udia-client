import { routerReducer } from "react-router-redux";
import { authReducer } from "Modules/Auth";
// import { nodesReducer } from "./nodes";

export const rootReducer = {
  routing: routerReducer,
  auth: authReducer,
  // nodes: nodesReducer
};
export default rootReducer;
