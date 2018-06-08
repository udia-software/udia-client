import { AUTH_TOKEN } from "../../../Constants";
import AuthActions, { IAuthAction } from "./Actions";

export interface IAuthState {
  username: string | null;
  email: string | null;
  password: string | null;
  jwt: string | null;
  confirmSignOut: boolean;
  authUser: any | null;
  emailVerificationToken: string | null;
  passwordResetToken: string | null;
}

const AuthState: IAuthState = {
  username: null,
  email: null,
  password: null,
  jwt: localStorage.getItem(AUTH_TOKEN),
  confirmSignOut: false,
  authUser: null,
  emailVerificationToken: null,
  passwordResetToken: null
};

export default (state: IAuthState = { ...AuthState }, action: IAuthAction) => {
  switch (action.type) {
    case AuthActions.SET_FORM_USERNAME:
      return {
        ...state,
        username: action.payload
      };
    case AuthActions.SET_FORM_PASSWORD:
      return {
        ...state,
        password: action.payload
      };
    case AuthActions.SET_FORM_EMAIL:
      return {
        ...state,
        email: action.payload
      };
    case AuthActions.SET_AUTH_USER:
      return {
        ...state,
        authUser: action.payload
      };
    case AuthActions.SET_AUTH_DATA:
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
    case AuthActions.SET_FORM_EMAIL_VERIFICATION_TOKEN:
      return {
        ...state,
        emailVerificationToken: action.payload
      };
    case AuthActions.SET_FORM_PASSWORD_RESET_TOKEN:
      return {
        ...state,
        passwordResetToken: action.payload
      };
    case AuthActions.CONFIRM_SIGN_OUT:
      return {
        ...state,
        confirmSignOut: true
      };
    case AuthActions.CLEAR_AUTH_DATA:
      localStorage.removeItem(AUTH_TOKEN);
      return {
        ...AuthState,
        passwordResetToken: state.passwordResetToken, // trying to reset password
        emailVerificationToken: state.emailVerificationToken, // trying to verify email
        jwt: null
      };
    default:
      return state;
  }
};
