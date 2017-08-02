import {
  IS_SENDING_AUTH,
  SET_AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  SET_SELF_USER,
  SET_USERNAME,
  SET_PASSWORD,
  SET_PASSWORD_CONFIRMATION
} from "./constants";

/**
 * Reducer action for setting loading in the signin/signup functionality
 * @param {boolean} sendingRequest - Boolean for if the request's sending
 */
export function isSendingAuth(sendingRequest) {
  return {
    type: IS_SENDING_AUTH,
    data: sendingRequest
  };
}

/**
 * Reducer action for setting an error message in the signin/signup functionality
 * @param {Object|string} exception - Exception object or string
 */
export function setAuthError(exception) {
  let response = exception.response || {};
  let data = response.data || {};
  let err = "" + exception;
  if (response.status) {
    err = `${response.status} ${response.statusText}`;
  }
  return {
    type: SET_AUTH_ERROR,
    data: data.errors || data.error || err
  };
}

/**
 * Reducer action for clearing an error message in the signin/signup functionality
 */
export function clearAuthError() {
  return {
    type: CLEAR_AUTH_ERROR
  };
}

/**
 * Reducer action for setting the authenticated user (self) object.
 * @param {Object|null} selfUser - The user object.
 */
export function setSelfUser(selfUser) {
  return {
    type: SET_SELF_USER,
    data: selfUser
  };
}

/**
 * Reducer action for setting the signin/signup form username string.
 * @param {string} username - Username string
 */
export function setUsername(username) {
  return {
    type: SET_USERNAME,
    data: username
  };
}

/**
 * Reducer action for setting the signin/signup form password string.
 * @param {string} password 
 */
export function setPassword(password) {
  return {
    type: SET_PASSWORD,
    data: password
  };
}

/**
 * Reducer action for setting the signup form password confirmation string.
 * @param {string} passwordConfirmation 
 */
export function setPasswordConfirmation(passwordConfirmation) {
  return {
    type: SET_PASSWORD_CONFIRMATION,
    data: passwordConfirmation
  };
}
