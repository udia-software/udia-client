import { Record } from "immutable";
import { authActions } from "./actions";
import { GC_AUTH_TOKEN } from "../../constants";

export const AuthState = new Record({
  username: "",
  email: "",
  password: "",
  understoodLesson: false,
  error: null,
  jwt: localStorage.getItem(GC_AUTH_TOKEN) || null,
  authUser: null // this is not stored locally, but we will pull it using stored JWT
});

export function authReducer(state = new AuthState(), { payload, type }) {
  switch (type) {
    case authActions.SET_FORM_USERNAME:
      return state.merge({
        username: payload
      });
    case authActions.SET_FORM_PASSWORD:
      return state.merge({
        password: payload
      });
    case authActions.SET_FORM_EMAIL:
      return state.merge({
        email: payload
      });
    case authActions.SET_AUTH_ERROR:
      return state.merge({
        error: payload
      });
    case authActions.SET_UNDERSTOOD_LESSON:
      return state.merge({
        understoodLesson: payload
      });
    case authActions.SET_AUTH_USER:
      return state.merge({
        authUser: payload
      });
    case authActions.SET_AUTH_DATA:
      localStorage.setItem(GC_AUTH_TOKEN, payload.jwt);
      return state.merge({
        authUser: payload.user,
        jwt: payload.jwt
      });
    case authActions.CLEAR_AUTH_DATA:
      localStorage.removeItem(GC_AUTH_TOKEN);
      return state.merge({
        jwt: null,
        authUser: null
      });
    default:
      return state;
  }
}
