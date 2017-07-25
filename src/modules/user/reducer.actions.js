import {
  IS_GETTING_USER,
  SET_USER_ERROR,
  CLEAR_USER_ERROR,
  SET_USER
} from "./constants";

/**
 * Reducer action for setting loading in the user functionality
 * @param {boolean} sendingRequest - Boolean for loading state
 */
export function isGettingUser(sendingRequest) {
  return {
    type: IS_GETTING_USER,
    data: sendingRequest
  };
}

/**
 * Reducer action for setting an error message in the posts functionality
 * @param {Object|String} exception - Exception object or string
 */
export function setUserError(exception) {
  let response = exception.response || {};
  let data = response.data || {};
  let err = `${response.status} ${response.statusText}`;
  return {
    type: SET_USER_ERROR,
    data: data.errors || data.error || err
  };
}

/**
 * Reducer action for clearing an error message in the posts functionality
 */
export function clearUserError() {
  return {
    type: CLEAR_USER_ERROR
  };
}

/**
 * Reducer action for setting the public viewable user (browsing their profile) object.
 * @param {Object|null} user - The user object.
 */
export function setUser(user) {
  return {
    type: SET_USER,
    data: user
  };
}
