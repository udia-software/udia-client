import { GET_USER_BY_USERNAME_REQUEST } from "./constants";

/**
 * Saga action for triggering an async Get User HTTP request
 * @param {Object} data - Saga get user by username payload
 * @param {string} data.username - The username to get user for
 */
export function getUserByUsernameRequest(data) {
  return {
    type: GET_USER_BY_USERNAME_REQUEST,
    data
  };
}
