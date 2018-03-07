export const authActions = {
  SET_FORM_USERNAME: "SET_FORM_USERNAME",
  SET_FORM_PASSWORD: "SET_FORM_PASSWORD",
  SET_FORM_EMAIL: "SET_FORM_EMAIL",
  SET_FORM_REMEMBER_ME: "SET_FORM_REMEMBER_ME",
  SET_AUTH_USER: "SET_AUTH_USER",
  SET_AUTH_DATA: "SET_AUTH_DATA",
  CLEAR_AUTH_DATA: "CLEAR_AUTH_DATA",

  setFormUsername: username => ({
    type: authActions.SET_FORM_USERNAME,
    payload: username
  }),
  setFormEmail: email => ({
    type: authActions.SET_FORM_EMAIL,
    payload: email
  }),
  setFormPassword: password => ({
    type: authActions.SET_FORM_PASSWORD,
    payload: password
  }),
  setFormRememberMe: rememberMe => ({
    type: authActions.SET_FORM_REMEMBER_ME,
    payload: rememberMe
  }),
  setAuthUser: user => ({
    type: authActions.SET_AUTH_USER,
    payload: user
  }),
  setAuthData: ({ user, jwt }) => ({
    type: authActions.SET_AUTH_DATA,
    payload: { user, jwt }
  }),
  clearAuthData: () => ({
    type: authActions.CLEAR_AUTH_DATA
  })
};

export default authActions;
