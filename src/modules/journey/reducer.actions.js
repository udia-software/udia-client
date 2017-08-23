import {
  IS_SENDING_JOURNEY,
  SET_JOURNEY_ERROR,
  CLEAR_JOURNEY_ERROR,
  SET_JOURNEY,
  SET_JOURNEY_TITLE,
  SET_JOURNEY_DESCRIPTION,
  SET_JOURNEY_START_DATE,
  SET_JOURNEY_END_DATE,
  SET_EDIT_JOURNEY_SUCCESS
} from "./constants";

/**
 * Reducer action for setting loading in the journey functionality
 * @param {boolean} sendingRequest - Boolean for if the request's sending
 */
export function isSendingJourney(sendingRequest) {
  return {
    type: IS_SENDING_JOURNEY,
    data: sendingRequest
  };
}

/**
 * Reducer action for setting an error message in the journey functionality
 * @param {Object|string} exception - Exception object or string
 */
export function setJourneyError(exception) {
  let response = exception.response || {};
  let data = response.data || {};
  let err = "" + exception;
  if (response.status) {
    err = `${response.status} ${response.statusText}`;
  }
  return {
    type: SET_JOURNEY_ERROR,
    data: data.errors || data.error || err
  };
}

/**
 * Reducer action for clearing an error message in the journey functionality
 */
export function clearJourneyError() {
  return {
    type: CLEAR_JOURNEY_ERROR
  };
}

/**
 * Reducer action for setting the journey object on viewing.
 * @param {Object|null} journey - The journey object
 */
export function setJourney(journey) {
  return {
    type: SET_JOURNEY,
    data: journey
  };
}

/**
 * Reducer action for setting the journey title on create/update.
 * @param {string} title - The title of the journey
 */
export function setJourneyTitle(title) {
  return {
    type: SET_JOURNEY_TITLE,
    data: title
  };
}

/**
 * Reducer action for setting the journey description on create/update.
 * @param {string} description - The description of the journey
 */
export function setJourneyDescription(description) {
  return {
    type: SET_JOURNEY_DESCRIPTION,
    data: description
  };
}

/**
 * Reducer action for setting the journey start date on create/update.
 * @param {string} date - The start date of the journey
 */
export function setJourneyStartDate(date) {
  return {
    type: SET_JOURNEY_START_DATE,
    data: date
  };
}

/**
 * Reducer action for setting the journey end date on create/update.
 * @param {string} date - The end date of the journey
 */
export function setJourneyEndDate(date) {
  return {
    type: SET_JOURNEY_END_DATE,
    data: date
  };
}

/**
 * Reducer action for setting the journey editing success value
 * @param {boolean} successful - Whether or not the edit journey request was successful
 */
export function setEditJourneySuccess(successful) {
  return {
    type: SET_EDIT_JOURNEY_SUCCESS,
    data: successful
  };
}
