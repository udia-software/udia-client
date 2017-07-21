import { effects } from "redux-saga";
import { getUser } from "./api";
import { GET_USER_BY_USERNAME_REQUEST } from "./constants";
import {
  isGettingUser,
  setUserError,
  clearUserError,
  setUser
} from "./reducer.actions";

/**
 * Generator function for getting a single user by username
 * @param {Object} data - Payload object for get user call
 * @param {string} data.username - Username to get user for
 */
function* getUserCall(data) {
  yield effects.put(isGettingUser(true));
  const { username } = data;
  try {
    return yield effects.call(getUser, username);
  } catch (exception) {
    yield effects.put(setUserError(exception));
    return false;
  } finally {
    yield effects.put(isGettingUser(false));
  }
}

/**
 * Saga for getting a user by username. Listen for GET_USER_BY_USERNAME_REQUEST action.
 */
export function* getUserFlow() {
  while (true) {
    const request = yield effects.take(GET_USER_BY_USERNAME_REQUEST);
    const wasSuccessful = yield effects.call(getUserCall, request.data);
    if (wasSuccessful) {
      yield effects.put(setUser(wasSuccessful.data));
      yield effects.put(clearUserError());
    }
  }
}
