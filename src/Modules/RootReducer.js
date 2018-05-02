// @flow
import type { IAuthState } from './Auth/Reducer';
import { AuthReducer } from './Auth';

export type IRootState = {
  auth: IAuthState,
};

export default {
  auth: AuthReducer,
};
