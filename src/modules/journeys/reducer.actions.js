import {
  IS_GETTING_JOURNEYS,
  SET_JOURNEYS_ERROR,
  CLEAR_JOURNEYS_ERROR,
  ADD_JOURNEYS,
  CLEAR_JOURNEYS,
  SET_JOURNEYS_PAGINATION
} from "./constants";

/**
 * Reducer action for setting loading in the journeys functionality
 * @param {boolean} sendingRequest - Boolean for loading state
 */
export function isGettingJourneys(sendingRequest) {
  return {
    type: IS_GETTING_JOURNEYS,
    data: sendingRequest
  }
}

/**
 * Reducer action for setting an error message in the journeys functionality
 * @param {Object|String} exception - Exception object or string
 */
export function setJourneysError(exception) {
  let response = exception.response || {};
  let data = response.data || {};
  let err = "" + exception;
  if (response.status) {
    err = `${response.status} ${response.statusText}`;
  }
  return {
    type: SET_JOURNEYS_ERROR,
    data: data.errors || data.error || err
  };
}

/**
 * Reducer action for clearing an error message in the journeys functionality
 */
export function clearJourneysError() {
  return {
    type: CLEAR_JOURNEYS_ERROR
  };
}

/**
 * Reducer action for adding journeys to the journeys functionality
 * @param {array} journeys - Array of journeys objects
 */
export function addJourneys(journeys) {
  return {
    type: ADD_JOURNEYS,
    data: journeys
  }
}

/**
 * Reducer action for clearing all journeys from the journeys functionality
 */
export function clearJourneys() {
  return {
    type: CLEAR_JOURNEYS
  }
}

/**
 * Reducer action for setting the journeys pagination data
 * @param {Object} pagination - Journeys pagination data
 */
export function setJourneysPagination(pagination) {
  return {
    type: SET_JOURNEYS_PAGINATION,
    data: pagination
  }
}