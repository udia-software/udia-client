import { effects } from "redux-saga";
import { getJourneys } from "./api";
import { GET_JOURNEYS_REQUEST } from "./constants";
import {
  isGettingJourneys,
  setJourneysError,
  clearJourneysError,
  clearJourneys,
  setJourneysPagination,
  addJourneys
} from "./reducer.actions";

/**
 * Generator function for getting journeys.
 * @param {Object} data - Payload for getting journeys
 * @param {string} data.page - Page of journeys to get
 */
function* getJourneysCall(data) {
  yield effects.put(isGettingJourneys(true));
  const { page } = data;
  try {
    return yield effects.call(getJourneys, page);
  } catch (exception) {
    yield effects.put(setJourneysError(exception));
    return false;
  } finally {
    yield effects.put(isGettingJourneys(false));
  }
}

/**
 * Saga for getting journeys. Listen for GET_JOURNEYS_REQUEST action.
 */
export function* getJourneysFlow() {
  while (true) {
    const request = yield effects.take(GET_JOURNEYS_REQUEST);
    const wasSuccessful = yield effects.call(getJourneysCall, request.data);
    if (wasSuccessful) {
      const { page_number } = wasSuccessful.pagination;
      if (page_number <= 1) yield effects.put(clearJourneys());
      yield effects.put(setJourneysPagination(wasSuccessful.pagination));
      yield effects.put(addJourneys(wasSuccessful.data));
      yield effects.put(clearJourneysError());
    }
  }
}
