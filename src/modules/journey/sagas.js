import { effects } from "redux-saga";
import { createJourney, getJourney, deleteJourney } from "./api";
import { CREATE_JOURNEY_REQUEST, GET_JOURNEY_REQUEST, DELETE_JOURNEY_REQUEST } from "./constants";
import {
  isSendingJourney,
  setJourneyError,
  clearJourneyError,
  setJourney,
  setJourneyTitle,
  setJourneyDescription
} from "./reducer.actions";

/**
 * Generator function for creating a journey
 * @param {Object} data - Create journey payload
 * @param {string} data.title - Title of journey
 * @param {string} data.description - Description of journey
 */
function* createJourneyCall(data) {
  yield effects.put(isSendingJourney(true));
  const { title, description } = data;
  try {
    return yield effects.call(createJourney, title, description);
  } catch (exception) {
    yield effects.put(setJourneyError(exception));
    return false;
  } finally {
    yield effects.put(isSendingJourney(false));
  }
}

/**
 * Generator function for getting a journey
 * @param {Object} data - Get journey payload
 * @param {string} data.id - ID of journey to get
 */
function* getJourneyCall(data) {
  yield effects.put(isSendingJourney(true));
  const { id } = data;
  try {
    return yield effects.call(getJourney, id);
  } catch (exception) {
    yield effects.put(setJourneyError(exception));
    return false;
  } finally {
    yield effects.put(isSendingJourney(false));
  }
}

/**
 * Generator function for deleting a journey
 * @param {Object} data - Delete journey payload
 * @param {string} data.id - ID of journey to get
 */
function* deleteJourneyCall(data) {
  yield effects.put(isSendingJourney(true));
  const { id } = data;
  try {
    return yield effects.call(deleteJourney, id);
  } catch (exception) {
    yield effects.put(setJourneyError(exception));
    return false;
  } finally {
    yield effects.put(isSendingJourney(false));
  }
}

/**
 * Saga for creating a new journey. Listen for CREATE_JOURNEY_REQUEST action.
 */
export function* createJourneyFlow() {
  while (true) {
    const request = yield effects.take(CREATE_JOURNEY_REQUEST);
    const wasSuccessful = yield effects.call(createJourneyCall, request.data);

    if (wasSuccessful) {
      yield effects.put(setJourneyTitle(""));
      yield effects.put(setJourneyDescription(""));
      yield effects.put(setJourney(wasSuccessful.data));
      yield effects.put(clearJourneyError());
      // TODO: Redirect to Journey Page
    }
  }
}

/**
 * Saga for getting a journey. Listen for GET_JOURNEY_REQUEST action.
 */
export function* getJourneyFlow() {
  while (true) {
    const request = yield effects.take(GET_JOURNEY_REQUEST);
    const wasSuccessful = yield effects.call(getJourneyCall, request.data);
    if (wasSuccessful) {
      yield effects.put(setJourney(wasSuccessful.data));
      yield effects.put(clearJourneyError());
    }
  }
}

/**
 * Saga for deleting a journey. Listen for DELETE_JOURNEY_REQUEST action.
 */
export function* deleteJourneyFlow() {
  while (true) {
    const request = yield effects.take(DELETE_JOURNEY_REQUEST);
    const wasSuccessful = yield effects.call(deleteJourneyCall, request.data);

    if (wasSuccessful) {
      yield effects.put(setJourney({}));
      yield effects.put(clearJourneyError());
      // TODO: Redirect to Journey Page
    }
  }
}
