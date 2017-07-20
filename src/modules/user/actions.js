import { SET_USER, GET_USER_BY_USERNAME_REQUEST } from "./constants";

/**
 * Redux action for setting the public viewable user (browsing their profile) object.
 * @param {Object|null} userState - The user object.
 */
export function setUser(user) {
  return {
    type: SET_USER,
    data: user
  };
}

export function getUserByUsernameRequest(username) {
  return {
    type: GET_USER_BY_USERNAME_REQUEST,
    data: username
  };
}
