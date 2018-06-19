import { AUTH_TOKEN } from "../../../Constants";
import {
  CLEAR_AUTH_DATA,
  CONFIRM_SIGN_OUT,
  IAuthAction,
  SET_AUTH_DATA,
  SET_AUTH_USER,
  SET_FORM_EMAIL,
  SET_FORM_EMAIL_VERIFICATION_TOKEN,
  SET_FORM_PASSWORD,
  SET_FORM_PASSWORD_RESET_TOKEN,
  SET_FORM_USERNAME
} from "./Actions";

export interface IUserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  createdAt: number;
  updatedAt: number;
  verificationExpiry: number;
}

export interface IFullUser {
  uuid: string;
  username: string;
  emails: IUserEmail[];
  encSecretKey: string;
  pubSignKey: string;
  encPrivSignKey: string;
  pubEncKey: string;
  encPrivEncKey: string;
  pwFunc: string;
  pwDigest: string;
  pwCost: number;
  pwKeySize: number;
  pwNonce: string;
  createdAt: number;
  updatedAt: number;
}

export interface IAuthState {
  username: string | null;
  email: string | null;
  password: string | null;
  jwt: string | null;
  confirmSignOut: boolean;
  authUser: IFullUser | null; // nested FullUser data with emails
  emailVerificationToken: string | null;
  passwordResetToken: string | null;
}

const DefaultAuthState: IAuthState = {
  username: null,
  email: null,
  password: null,
  jwt: localStorage.getItem(AUTH_TOKEN),
  confirmSignOut: false,
  authUser: null,
  emailVerificationToken: null,
  passwordResetToken: null
};

/**
 * Auth reducer state is blacklisted from being persisted in IndexDB.
 * However, JWT is stored in localstorage.
 */
export default (state: IAuthState = { ...DefaultAuthState }, action: IAuthAction) => {
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
    case SET_AUTH_DATA:
      localStorage.setItem(AUTH_TOKEN, action.payload.jwt);
      return {
        ...state,
        username: null,
        email: null,
        password: null,
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
