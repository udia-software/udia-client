// @flow
import type { IAuthState } from "./Auth/Reducer";
import { authReducer } from "./Auth";
// import { nodesReducer } from "./nodes";

export type IRootState = {
  auth: IAuthState
}

export const rootReducer = {
  auth: authReducer
  // nodes: nodesReducer
};
export default rootReducer;
