import {
  SET_PRESENCE_STATE,
  HANDLE_PRESENCE_DIFF,
  CLEAR_PRESENCE_STATE
} from "./constants";

/**
 * Reducer action for setting the state of the presences
 * @param {object} presenceState - Phoenix WS object on "presence_state" call
 */
export function setPresenceState(presenceState) {
  return {
    type: SET_PRESENCE_STATE,
    data: presenceState
  };
}

/**
 * Reducer action for handling the diff of the presences
 * @param {object} presenceDiff - Phoenix WS object on "presence_diff" call
 * @param {object} presenceDiff.joins - All users that have since joined
 * @param {object} presenceDiff.leaves - All users that have since left
 */
export function handlePresenceDiff(presenceDiff) {
  return {
    type: HANDLE_PRESENCE_DIFF,
    data: presenceDiff
  };
}

/**
 * Reducer action for clearing the presence state
 */
export function clearPresenceState() {
  return { type: CLEAR_PRESENCE_STATE };
}
