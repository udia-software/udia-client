import { AUTH_TOKEN } from "../../../Constants";
import {
  CLEAR_AUTH_DATA,
  CONFIRM_SIGN_OUT,
  IAuthAction,
  SET_AUTH_DATA,
  SET_AUTH_JWT,
  SET_AUTH_USER,
  SET_FORM_EMAIL,
  SET_FORM_EMAIL_VERIFICATION_TOKEN,
  SET_FORM_PASSWORD,
  SET_FORM_PASSWORD_RESET_TOKEN,
  SET_FORM_USERNAME
} from "./Actions";

export interface IAuthState {
  username: string;
  email: string;
  password: string;
  jwt: string | null;
  confirmSignOut: boolean;
  authUser: FullUser | null; // nested FullUser data with emails
  emailVerificationToken: string;
  passwordResetToken: string;
}

const DefaultAuthState: IAuthState = {
  username: "",
  email: "",
  password: "",
  jwt: localStorage.getItem(AUTH_TOKEN),
  confirmSignOut: false,
  authUser: null,
  emailVerificationToken: "",
  passwordResetToken: ""
};

export const AuthPersistBlacklist = [
  "username",
  "email",
  "password",
  "confirmSignOut",
  "authUser",
  "emailVerificationToken",
  "passwordResetToken"
];

/**
 * Auth reducer state is blacklisted from being persisted in IndexDB.
 * However, JWT is stored in localstorage.
 */
export default (
  state: IAuthState = { ...DefaultAuthState },
  action: IAuthAction
) => {
  switch (action.type) {
    case SET_FORM_USERNAME:
      return {
        ...state,
        username: action.payload
      };
    case SET_FORM_PASSWORD:
      return {
        ...state,
        password: action.payload
      };
    case SET_FORM_EMAIL:
      return {
        ...state,
        email: action.payload
      };
    case SET_AUTH_USER:
      return {
        ...state,
        authUser: action.payload
      };
    case SET_AUTH_JWT:
      return {
        ...state,
        jwt: action.payload
      };
    case SET_AUTH_DATA:
      localStorage.setItem(AUTH_TOKEN, action.payload.jwt);
      return {
        ...state,
        username: "",
        email: "",
        password: "",
        authUser: action.payload.user,
        jwt: action.payload.jwt
      };
    case SET_FORM_EMAIL_VERIFICATION_TOKEN:
      return {
        ...state,
        emailVerificationToken: action.payload
      };
    case SET_FORM_PASSWORD_RESET_TOKEN:
      return {
        ...state,
        passwordResetToken: action.payload
      };
    case CONFIRM_SIGN_OUT:
      return {
        ...state,
        confirmSignOut: true
      };
    case CLEAR_AUTH_DATA:
      localStorage.removeItem(AUTH_TOKEN);
      return {
        ...DefaultAuthState,
        passwordResetToken: state.passwordResetToken, // trying to reset password
        emailVerificationToken: state.emailVerificationToken, // trying to verify email
        jwt: null
      };
    default:
      return state;
  }
};
