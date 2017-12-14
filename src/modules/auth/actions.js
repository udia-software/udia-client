export const authActions = {
  //===========
  //  Reducer
  //===========
  SET_FORM_USERNAME: "SET_FORM_USERNAME",
  SET_FORM_PASSWORD: "SET_FORM_PASSWORD",
  SET_FORM_EMAIL: "SET_FORM_EMAIL",
  SET_AUTH_ERROR: "SET_AUTH_ERROR",
  SET_UNDERSTOOD_LESSON: "SET_UNDERSTOOD_LESSON",
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
  setAuthError: error => ({
    type: authActions.SET_AUTH_ERROR,
    payload: error
  }),
  setUnderstoodLesson: understood => ({
    type: authActions.SET_UNDERSTOOD_LESSON,
    payload: understood
  }),
  setAuthUser: user => ({
    type: authActions.SET_AUTH_USER,
    payload: user
  }),
  setAuthData: ({user, jwt}) => ({
    type: authActions.SET_AUTH_DATA,
    payload: {user, jwt}
  }),
  clearAuthData: () => ({
    type: authActions.CLEAR_AUTH_DATA
  })
};
