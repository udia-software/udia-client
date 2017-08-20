import { effects } from "redux-saga";
import { getPerceptions } from "./api";
import { getPerceptionsRequest } from "./sagas.actions";
import {
  isGettingPerceptions,
  setPerceptionsError,
  clearPerceptionsError,
  clearPerceptions,
  setPerceptionsPagination,
  addPerceptions
} from "./reducer.actions";

function* getPerceptionsCall(data) {
  yield effects.put(isGettingPerceptions(true));
  try {
    return yield effects.call(getPerceptions, data);
  } catch (exception) {
    yield effects.put(setPerceptionsError(exception));
    return false;
  } finally {
    yield effects.put(isGettingPerceptions(false));
  }
}

export function* getPerceptionsFlow(action) {
  const wasSuccessful = yield effects.call(getPerceptionsCall, action.data);
  if (wasSuccessful) {
    const { page_number, total_pages } = wasSuccessful.pagination;
    if (page_number <= 1) yield effects.put(clearPerceptions());
    yield effects.put(setPerceptionsPagination(wasSuccessful.pagination));
    yield effects.put(addPerceptions(wasSuccessful.data));
    yield effects.put(clearPerceptionsError());
    if (page_number < total_pages) {
      yield effects.put(
        getPerceptionsRequest({
          ...action.data,
          page: page_number + 1
        })
      );
    }
  }
}
