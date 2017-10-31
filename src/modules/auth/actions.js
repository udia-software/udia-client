export const authActions = {
  //===========
  //  Reducer
  //===========
  SET_FORM_USERNAME: "SET_FORM_USERNAME",
  SET_FORM_PASSWORD: "SET_FORM_PASSWORD",
  SET_FORM_PASSWORD_CONFIRMATION: "SET_FORM_PASSWORD_CONFIRMATION",

  setFormUsername: username => ({
    type: authActions.SET_FORM_USERNAME,
    payload: username
  }),
  setFormPassword: password => ({
    type: authActions.SET_FORM_PASSWORD,
    payload: password
  }),
  setFormPasswordConfirmation: passwordConfirmation => ({
    type: authActions.SET_FORM_PASSWORD_CONFIRMATION,
    payload: passwordConfirmation
  }),

  //========
  //  Saga
  //========
  SIGN_IN_REQUEST: "SIGN_IN_REQUEST"
};
