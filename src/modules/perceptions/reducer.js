import {
  IS_GETTING_PERCEPTIONS,
  SET_PERCEPTIONS_ERROR,
  CLEAR_PERCEPTIONS_ERROR,
  ADD_PERCEPTIONS,
  CLEAR_PERCEPTIONS,
  SET_PERCEPTIONS_PAGINATION
} from "./constants";

const initialState = {
  currentlyGettingPerceptions: false,
  perceptionsRequestError: "",
  perceptionsPagination: {},
  perceptions: []
};

function perceptionsReducer(state = initialState, action) {
  switch (action.type) {
    case IS_GETTING_PERCEPTIONS:
      return {
        ...state,
        currentlyGettingPerceptions: action.data
      };
    case SET_PERCEPTIONS_ERROR:
      return {
        ...state,
        perceptionsRequestError: action.data
      };
    case CLEAR_PERCEPTIONS_ERROR:
      return {
        ...state,
        perceptionsRequestError: ""
      };
    case ADD_PERCEPTIONS:
      return {
        ...state,
        perceptions: state.perceptions.concat(action.data)
      };
    case SET_PERCEPTIONS_PAGINATION:
      return {
        ...state,
        perceptionsPagination: action.data
      };
    case CLEAR_PERCEPTIONS:
      return initialState;
    default:
      return state;
  }
}

export default perceptionsReducer;
