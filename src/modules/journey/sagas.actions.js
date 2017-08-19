import { CREATE_JOURNEY_REQUEST, GET_JOURNEY_REQUEST } from "./constants";

/**
 * Saga action for triggering an async Create Journey HTTP request
 * @param {Object} data - Saga create journey payload
 * @param {string} data.title - Title of journey
 * @param {string} data.journey - Description of journey
 */
export function createJourneyRequest(data) {
  return {
    type: CREATE_JOURNEY_REQUEST,
    data
  };
}

/**
 * Saga action for triggering an async Get Journey HTTP request
 * @param {Object} data - Saga get journey payload
 * @param {string} data.id - ID of journey to get
 */
export function getJourneyRequest(data) {
  return {
    type: GET_JOURNEY_REQUEST,
    data
  };
}