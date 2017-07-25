import { LOGIN_REQUEST, LOGOUT_REQUEST, REGISTER_REQUEST } from "./constants";

/**
 * Saga action for triggering an async Log In HTTP request.
 * @param {Object} data - Saga login payload
 * @param {string} data.username - The login username
 * @param {string} data.password - The login password
 */
export function loginRequest(data) {
  return {
    type: LOGIN_REQUEST,
    data
  };
}

/**
 * Saga action for triggering an async Log Out HTTP request.
 */
export function logoutRequest() {
  return {
    type: LOGOUT_REQUEST
  };
}

/**
 * Saga action for triggering an async Register HTTP request.
 * @param {Object} data - Saga login payload
 * @param {string} data.username - The login username
 * @param {string} data.password - The login password
 */
export function registerRequest(data) {
  return {
    type: REGISTER_REQUEST,
    data
  };
}