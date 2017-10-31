import { Record } from "immutable";
import { authActions } from "./actions";

export const AuthState = new Record({
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
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
    default:
      return state;
  }
}
