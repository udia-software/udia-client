import {
  IS_SENDING_JOURNEY,
  SET_JOURNEY_ERROR,
  CLEAR_JOURNEY_ERROR,
  SET_JOURNEY,
  SET_JOURNEY_TITLE,
  SET_JOURNEY_DESCRIPTION,
  SET_JOURNEY_START_DATE,
  SET_JOURNEY_END_DATE
} from "./constants";

const initialState = {
  sendingJourneyRequest: false,
  journeyRequestError: "",
  journey: {},
  title: "",
  description: "",
  start_date: new Date(),
  end_date: null
};

function journeyReducer(state = initialState, action) {
  switch (action.type) {
    case IS_SENDING_JOURNEY:
      return {
        ...state,
        sendingJourneyRequest: action.data
      };
    case SET_JOURNEY_ERROR:
      return {
        ...state,
        journeyRequestError: action.data
      };
    case CLEAR_JOURNEY_ERROR:
      return {
        ...state,
        journeyRequestError: ""
      };
    case SET_JOURNEY:
      return {
        ...state,
        journey: action.data
      };
    case SET_JOURNEY_TITLE:
      return {
        ...state,
        title: action.data
      };
    case SET_JOURNEY_DESCRIPTION:
      return {
        ...state,
        description: action.data
      };
    case SET_JOURNEY_START_DATE:
      return {
        ...state,
        start_date: action.data
      };
    case SET_JOURNEY_END_DATE:
      return {
        ...state,
        end_date: action.data
      };
    default:
      return state;
  }
}

export default journeyReducer;
