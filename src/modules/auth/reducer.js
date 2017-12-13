import { Record } from "immutable";
import { authActions } from "./actions";

// Put that JWT into local storage.

export const AuthState = new Record({
  username: "",
  email: "",
  password: "",
  understoodLesson: false,
  error: null,
  jwt: null
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
      })
    case authActions.SET_UNDERSTOOD_LESSON:
      return state.merge({
        understoodLesson: payload
      })
    default:
      return state;
  }
}
