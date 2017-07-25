import { effects } from "redux-saga";
import {
  isSendingAuth,
  setAuthError,
  clearAuthError,
  setSelfUser,
  setUsername,
  setPassword,
  setPasswordConfirmation
} from "./reducer.actions";
import { signup, signin, signout } from "./api";
import { LOGIN_REQUEST, LOGOUT_REQUEST, REGISTER_REQUEST } from "./constants";

/**
 * Generator function for registering a user.
 * @param {Object} data 
 * @param {string} data.username
 * @param {string} data.password
 */
function* register(data) {
  yield effects.put(isSendingAuth(true));
  const { username, password } = data;
  try {
    return yield effects.call(signup, username, password);
  } catch (exception) {
    yield effects.put(setAuthError(exception));
    return false;
  } finally {
    yield effects.put(isSendingAuth(false));
  }
}

/**
 * Generator function for authenticating a user.
 * @param {Object} data 
 * @param {string} data.username
 * @param {string} data.password
 */
function* login(data) {
  yield effects.put(isSendingAuth(true));
  const { username, password } = data;
  try {
    return yield effects.call(signin, username, password);
  } catch (exception) {
    yield effects.put(setAuthError(exception));
    return false;
  } finally {
    yield effects.put(isSendingAuth(false));
  }
}

/**
 * Generator function for un-authenticating a user.
 */
function* logout() {
  yield effects.put(isSendingAuth(true));
  try {
    return yield effects.call(signout);
  } catch (exception) {
    yield effects.put(setAuthError(exception));
    return false;
  } finally {
    yield effects.put(isSendingAuth(false));
  }
}

/**
 * Saga for registering a new user. Listen for REGISTER_REQUEST action.
 */
export function* registerFlow() {
  while (true) {
    const request = yield effects.take(REGISTER_REQUEST);
    const wasSuccessful = yield effects.call(register, request.data);
    if (wasSuccessful) {
      yield effects.put(setSelfUser(wasSuccessful.user));
      yield effects.put(clearAuthError());
      yield effects.put(setUsername(""));
      yield effects.put(setPassword(""));
      yield effects.put(setPasswordConfirmation(""));
    }
  }
}

/**
 * Saga for logging a user in. Listen for LOGIN_REQUEST action.
 */
export function* loginFlow() {
  while (true) {
    const request = yield effects.take(LOGIN_REQUEST);
    const wasSuccessful = yield effects.call(login, request.data);

    if (wasSuccessful) {
      yield effects.put(setSelfUser(wasSuccessful.user));
      yield effects.put(clearAuthError());
      yield effects.put(setUsername(""));
      yield effects.put(setPassword(""));
      yield effects.put(setPasswordConfirmation(""));
    }
  }
}

/**
 * Saga for logging out a user. Listen for LOGOUT_REQUEST action.
 */
export function* logoutFlow() {
  while (true) {
    yield effects.take(LOGOUT_REQUEST);
    yield effects.put(setSelfUser(null));
    const wasSuccessful = yield effects.call(logout);
    if (wasSuccessful) {
      yield effects.put(clearAuthError());
      yield effects.put(setUsername(""));
      yield effects.put(setPassword(""));
      yield effects.put(setPasswordConfirmation(""));
    }
  }
}
