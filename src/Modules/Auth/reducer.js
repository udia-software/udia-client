import { AUTH_TOKEN } from "Constants";
import { authActions } from "./actions";

const AuthState = {
  username: "",
  email: "",
  password: "",
  rememberMe: false,
  jwt: localStorage.getItem(AUTH_TOKEN) || null,
  authUser: null
};

export function authReducer(state = { ...AuthState }, { payload, type }) {
  switch (type) {
    case authActions.SET_FORM_USERNAME:
      return {
        ...state,
        username: payload
      };
    case authActions.SET_FORM_PASSWORD:
      return {
        ...state,
        password: payload
      };
    case authActions.SET_FORM_EMAIL:
      return {
        ...state,
        email: payload
      };
    case authActions.SET_UNDERSTOOD_LESSON:
      return {
        ...state,
        understoodLesson: payload
      };
    case authActions.SET_AUTH_USER:
      return {
        ...state,
        authUser: payload
      };
    case authActions.SET_AUTH_DATA:
      localStorage.setItem(AUTH_TOKEN, payload.jwt);
      return {
        ...state,
        username: "",
        email: "",
        password: "",
        understoodLesson: false,
        authUser: payload.user,
        jwt: payload.jwt
      };
    case authActions.CLEAR_AUTH_DATA:
      localStorage.removeItem(AUTH_TOKEN);
      return {
        ...state,
        jwt: null,
        authUser: null
      };
    default:
      return state;
  }
}

export default authReducer;
