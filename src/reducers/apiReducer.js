import {
  SENDING_REQUEST,
  REQUEST_ERROR,
  CLEAR_ERROR
} from '../actions/constants';

// The initial application state
const initialState = {
  error: '',
  currentlySending: false,
};

// Takes care of changing the application state
function apiReducer(state = initialState, action) {
  switch (action.type) {
    case SENDING_REQUEST:
      return {
        ...state,
        currentlySending: action.sending,
      };
    case REQUEST_ERROR:
      return {
        ...state,
        error: action.error,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: ''
      };
    default:
     return state;
  }
}

export default apiReducer;
