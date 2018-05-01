// @flow
const SET_FORM_USERNAME: "auth/SET_FORM_USERNAME" = "auth/SET_FORM_USERNAME";
const SET_FORM_PASSWORD: "auth/SET_FORM_PASSWORD" = "auth/SET_FORM_PASSWORD";
const SET_FORM_EMAIL: "auth/SET_FORM_EMAIL" = "auth/SET_FORM_EMAIL";
const SET_AUTH_USER: "auth/SET_AUTH_USER" = "auth/SET_AUTH_USER";
const SET_AUTH_DATA: "auth/SET_AUTH_DATA" = "auth/SET_AUTH_DATA";
const CONFIRM_SIGN_OUT: "auth/CONFIRM_SIGN_OUT" = "auth/CONFIRM_SIGN_OUT";
const CLEAR_AUTH_DATA: "auth/CLEAR_AUTH_DATA" = "auth/CLEAR_AUTH_DATA";

interface ISetFormUsernameAuthAction {
  type: typeof SET_FORM_USERNAME;
  payload: string;
}

interface ISetFormEmailAuthAction {
  type: typeof SET_FORM_EMAIL;
  payload: string;
}

interface ISetFormPasswordAuthAction {
  type: typeof SET_FORM_PASSWORD;
  payload: string;
}

interface ISetAuthUserAuthAction {
  type: typeof SET_AUTH_USER;
  payload: any;
}

interface ISetAuthDataAuthAction {
  type: typeof SET_AUTH_DATA;
  payload: any;
}

interface IConfirmSignOutAuthAction {
  type: typeof CONFIRM_SIGN_OUT;
  payload?: any;
}

interface IClearAuthDataAuthActions {
  type: typeof CLEAR_AUTH_DATA;
  payload?: any;
}

export type IAuthAction =
  | ISetFormUsernameAuthAction
  | ISetFormEmailAuthAction
  | ISetFormPasswordAuthAction
  | ISetAuthUserAuthAction
  | ISetAuthDataAuthAction
  | IConfirmSignOutAuthAction
  | IClearAuthDataAuthActions;

const setFormUsername = (username: string): ISetFormUsernameAuthAction => ({
  type: SET_FORM_USERNAME,
  payload: username
});

const setFormEmail = (email: string): ISetFormEmailAuthAction => ({
  type: SET_FORM_EMAIL,
  payload: email
});

const setFormPassword = (password: string): ISetFormPasswordAuthAction => ({
  type: SET_FORM_PASSWORD,
  payload: password
});

const setAuthUser = (user: any): ISetAuthUserAuthAction => ({
  type: SET_AUTH_USER,
  payload: user
});

const setAuthData = ({ user, jwt }: any): ISetAuthDataAuthAction => ({
  type: SET_AUTH_DATA,
  payload: { user, jwt }
});

const confirmSignOut = (): IConfirmSignOutAuthAction => ({
  type: CONFIRM_SIGN_OUT
});

const clearAuthData = (): IClearAuthDataAuthActions => ({
  type: CLEAR_AUTH_DATA
});

export const AuthActions = {
  // action type strings
  SET_FORM_USERNAME,
  SET_FORM_PASSWORD,
  SET_FORM_EMAIL,
  SET_AUTH_USER,
  SET_AUTH_DATA,
  CONFIRM_SIGN_OUT,
  CLEAR_AUTH_DATA,

  // action creation functions
  setFormUsername,
  setFormEmail,
  setFormPassword,
  setAuthUser,
  setAuthData,
  confirmSignOut,
  clearAuthData
};
