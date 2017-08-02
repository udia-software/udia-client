import { GET_JOURNEYS_REQUEST } from "./constants";

/**
 * Saga action for triggering an async Get Journeys HTTP request
 * @param {Object} data - Saga get journeys payload
 * @param {string} data.page - The page of journeys to get
 * @param {string} data.username - The username for journeys to query for
 */
export function getJourneysRequest(data) {
  return {
    type: GET_JOURNEYS_REQUEST,
    data
  }
}
