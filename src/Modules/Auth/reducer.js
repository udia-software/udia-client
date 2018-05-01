// @flow
import type { IAuthAction } from "./actions";
import { AUTH_TOKEN } from "../../Constants";
import { authActions } from "./actions";

export interface IAuthState {
  username: string;
  email: string;
  password: string;
  jwt: string | null;
  confirmSignOut: boolean;
  authUser: any | null;
}

const AuthState: IAuthState = {
  username: "",
  email: "",
  password: "",
  jwt: localStorage.getItem(AUTH_TOKEN) || null,
  confirmSignOut: false,
  authUser: null
};

export function authReducer(
  state: IAuthState = { ...AuthState },
  action: IAuthAction
) {
  switch (action.type) {
    case authActions.SET_FORM_USERNAME:
      return {
        ...state,
        username: action.payload
      };
    case authActions.SET_FORM_PASSWORD:
      return {
        ...state,
        password: action.payload
      };
    case authActions.SET_FORM_EMAIL:
      return {
        ...state,
        email: action.payload
      };
    case authActions.SET_AUTH_USER:
      return {
        ...state,
        authUser: action.payload
      };
    case authActions.SET_AUTH_DATA:
      localStorage.setItem(AUTH_TOKEN, action.payload.jwt);
      return {
        ...state,
        username: "",
        email: "",
        password: "",
        understoodLesson: false,
        authUser: action.payload.user,
        jwt: action.payload.jwt
      };
    case authActions.CONFIRM_SIGN_OUT:
      return {
        ...state,
        confirmSignOut: true
      };
    case authActions.CLEAR_AUTH_DATA:
      localStorage.removeItem(AUTH_TOKEN);
      return {
        ...AuthState,
        jwt: null
      };
    default:
      return state;
  }
}

export default authReducer;
