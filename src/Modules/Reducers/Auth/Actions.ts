import { FullUser } from "../../../Types";

// Action serializable and unique type strings
export const SET_FORM_USERNAME: "auth/SET_FORM_USERNAME" =
  "auth/SET_FORM_USERNAME";
export const SET_FORM_PASSWORD: "auth/SET_FORM_PASSWORD" =
  "auth/SET_FORM_PASSWORD";
export const SET_FORM_EMAIL: "auth/SET_FORM_EMAIL" = "auth/SET_FORM_EMAIL";
export const SET_AUTH_USER: "auth/SET_AUTH_USER" = "auth/SET_AUTH_USER";
export const SET_AUTH_JWT: "auth/SET_AUTH_JWT" = "auth/SET_AUTH_JWT";
export const SET_AUTH_DATA: "auth/SET_AUTH_DATA" = "auth/SET_AUTH_DATA";
export const SET_FORM_EMAIL_VERIFICATION_TOKEN: "auth/SET_FORM_EMAIL_VERIFICATION_TOKEN" =
  "auth/SET_FORM_EMAIL_VERIFICATION_TOKEN";
export const SET_FORM_PASSWORD_RESET_TOKEN: "auth/SET_FORM_PASSWORD_RESET_TOKEN" =
  "auth/SET_FORM_PASSWORD_RESET_TOKEN";
export const CONFIRM_SIGN_OUT: "auth/CONFIRM_SIGN_OUT" =
  "auth/CONFIRM_SIGN_OUT";
export const CLEAR_AUTH_DATA: "auth/CLEAR_AUTH_DATA" = "auth/CLEAR_AUTH_DATA";

// Action interfaces
export interface ISetFormUsernameAuthAction {
  type: typeof SET_FORM_USERNAME;
  payload: string;
}

export interface ISetFormEmailAuthAction {
  type: typeof SET_FORM_EMAIL;
  payload: string;
}

export interface ISetFormPasswordAuthAction {
  type: typeof SET_FORM_PASSWORD;
  payload: string;
}

export interface ISetAuthUserAuthAction {
  type: typeof SET_AUTH_USER;
  payload: FullUser;
}

export interface ISetAuthJWTAuthAction {
  type: typeof SET_AUTH_JWT;
  payload: string | null;
}

export interface ISetAuthDataAuthAction {
  type: typeof SET_AUTH_DATA;
  payload: { user: FullUser; jwt: string };
}

export interface ISetFormEmailVerificationTokenAction {
  type: typeof SET_FORM_EMAIL_VERIFICATION_TOKEN;
  payload: string;
}

export interface ISetFormPasswordResetTokenAction {
  type: typeof SET_FORM_PASSWORD_RESET_TOKEN;
  payload: string;
}

export interface IConfirmSignOutAuthAction {
  type: typeof CONFIRM_SIGN_OUT;
}

export interface IClearAuthDataAuthActions {
  type: typeof CLEAR_AUTH_DATA;
}

export type IAuthAction =
  | ISetFormUsernameAuthAction
  | ISetFormEmailAuthAction
  | ISetFormPasswordAuthAction
  | ISetAuthUserAuthAction
  | ISetAuthJWTAuthAction
  | ISetAuthDataAuthAction
  | ISetFormEmailVerificationTokenAction
  | ISetFormPasswordResetTokenAction
  | IConfirmSignOutAuthAction
  | IClearAuthDataAuthActions;

export const setFormUsername = (
  username: string
): ISetFormUsernameAuthAction => ({
  type: SET_FORM_USERNAME,
  payload: username
});

export const setFormEmail = (email: string): ISetFormEmailAuthAction => ({
  type: SET_FORM_EMAIL,
  payload: email
});

export const setFormPassword = (
  password: string
): ISetFormPasswordAuthAction => ({
  type: SET_FORM_PASSWORD,
  payload: password
});

export const setAuthUser = (user: FullUser): ISetAuthUserAuthAction => ({
  type: SET_AUTH_USER,
  payload: user
});

export const setAuthJWT = (jwt: string | null): ISetAuthJWTAuthAction => ({
  type: SET_AUTH_JWT,
  payload: jwt
});

export const setAuthData = ({
  user,
  jwt
}: {
  user: FullUser;
  jwt: string;
}): ISetAuthDataAuthAction => ({
  type: SET_AUTH_DATA,
  payload: { user, jwt }
});

export const setFormEmailVerificationToken = (
  token: string
): ISetFormEmailVerificationTokenAction => ({
  type: SET_FORM_EMAIL_VERIFICATION_TOKEN,
  payload: token
});

export const setFormPasswordResetToken = (
  token: string
): ISetFormPasswordResetTokenAction => ({
  type: SET_FORM_PASSWORD_RESET_TOKEN,
  payload: token
});

export const confirmSignOut = (): IConfirmSignOutAuthAction => ({
  type: CONFIRM_SIGN_OUT
});

export const clearAuthData = (): IClearAuthDataAuthActions => ({
  type: CLEAR_AUTH_DATA
});
