import {
  IS_GETTING_PERCEPTIONS,
  SET_PERCEPTIONS_ERROR,
  CLEAR_PERCEPTIONS_ERROR,
  ADD_PERCEPTIONS,
  CLEAR_PERCEPTIONS,
  SET_PERCEPTIONS_PAGINATION
} from "./constants";

export function isGettingPerceptions(sendingRequest) {
  return {
    type: IS_GETTING_PERCEPTIONS,
    data: sendingRequest
  };
}

export function setPerceptionsError(exception) {
  let response = exception.response || {};
  let data = response.data || {};
  let err = "" + exception;
  if (response.status) {
    err = `${response.status} ${response.statusText}`;
  }
  return {
    type: SET_PERCEPTIONS_ERROR,
    data: data.errors || data.error || err
  };
}

export function clearPerceptionsError() {
  return {
    type: CLEAR_PERCEPTIONS_ERROR
  };
}

export function addPerceptions(perceptions) {
  return {
    type: ADD_PERCEPTIONS,
    data: perceptions
  };
}

export function clearPerceptions() {
  return {
    type: CLEAR_PERCEPTIONS
  };
}

export function setPerceptionsPagination(pagination) {
  return {
    type: SET_PERCEPTIONS_PAGINATION,
    data: pagination
  };
}
