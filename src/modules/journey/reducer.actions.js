import {
  IS_SENDING_JOURNEY,
  SET_JOURNEY_ERROR,
  CLEAR_JOURNEY_ERROR,
  SET_JOURNEY,
  SET_JOURNEY_TITLE,
  SET_JOURNEY_DESCRIPTION
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
  let err = `${response.status} ${response.statusText}`;
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
 * @param {string} content - The content of the journey
 */
export function setJourneyContent(content) {
  return {
    type: SET_JOURNEY_CONTENT,
    data: content
  };
}
