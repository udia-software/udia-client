export const authActions = {
  //===========
  //  Reducer
  //===========
  SET_FORM_USERNAME: "SET_FORM_USERNAME",
  SET_FORM_PASSWORD: "SET_FORM_PASSWORD",
  SET_FORM_EMAIL: "SET_FORM_EMAIL",
  SET_AUTH_ERROR: "SET_AUTH_ERROR",
  SET_UNDERSTOOD_LESSON: "SET_UNDERSTOOD_LESSON",
  SET_JWT: "SET_JWT",
  CLEAR_JWT: "CLEAR_JWT",
  SET_AUTH_USER: "SET_AUTH_USER",

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
  setAuthError: error => ({
    type: authActions.SET_AUTH_ERROR,
    payload: error
  }),
  setUnderstoodLesson: understood => ({
    type: authActions.SET_UNDERSTOOD_LESSON,
    payload: understood
  }),
  setJWT: jwt => ({
    type: authActions.SET_JWT,
    payload: jwt
  }),
  clearJWT: () => ({
    type: authActions.CLEAR_JWT
  }),
  setAuthUser: user => ({
    type: authActions.SET_AUTH_USER,
    payload: user
  })
};
