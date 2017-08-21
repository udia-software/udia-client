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

const initialState = {
  sendingJourneyRequest: false,
  journeyRequestError: "",
  journey: {
    title: "",
    description: "",
    start_date: new Date(),
    end_date: null
  },
  editSuccess: false
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
        journey: {
          ...state.journey,
          title: action.data
        }
      };
    case SET_JOURNEY_DESCRIPTION:
      return {
        ...state,
        journey: {
          ...state.journey,
          description: action.data
        }
      };
    case SET_JOURNEY_START_DATE:
      return {
        ...state,
        journey: {
          ...state.journey,
          start_date: action.data
        }
      };
    case SET_JOURNEY_END_DATE:
      return {
        ...state,
        journey: {
          ...state.journey,
          end_date: action.data
        }
      };
    case SET_EDIT_JOURNEY_SUCCESS:
      return {
        ...state,
        editSuccess: action.data
      };
    default:
      return state;
  }
}

export default journeyReducer;
