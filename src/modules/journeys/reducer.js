import {
  IS_GETTING_JOURNEYS,
  SET_JOURNEYS_ERROR,
  CLEAR_JOURNEYS_ERROR,
  ADD_JOURNEYS,
  CLEAR_JOURNEYS,
  SET_JOURNEYS_PAGINATION
} from "./constants";

const initialState = {
  currentlyGettingJourneys: false,
  journeysRequestError: "",
  journeysPagination: {},
  journeys: []
};

function journeysReducer(state = initialState, action) {
  switch (action.type) {
    case IS_GETTING_JOURNEYS:
      return {
        ...state,
        currentlyGettingJourneys: action.data
      };
    case SET_JOURNEYS_ERROR:
      return {
        ...state,
        journeysRequestError: action.data
      };
    case CLEAR_JOURNEYS_ERROR:
      return {
        ...state,
        journeysRequestError: ""
      };
    case ADD_JOURNEYS:
      return {
        ...state,
        journeys: state.journeys.concat(action.data)
      };
    case SET_JOURNEYS_PAGINATION:
      return {
        ...state,
        journeysPagination: action.data
      };
    case CLEAR_JOURNEYS:
      return initialState;
    default:
      return state;
  }
}

export default journeysReducer;
