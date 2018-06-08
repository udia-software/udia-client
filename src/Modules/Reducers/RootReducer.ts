import AuthReducer, { IAuthState } from "./Auth/Reducer";

export interface IRootState {
  auth: IAuthState;
}

const RootReducer = {
  auth: AuthReducer
};

export default RootReducer;
