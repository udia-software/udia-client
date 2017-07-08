import {
  SET_AUTH,
  SET_USER,
  SENDING_REQUEST,
  REQUEST_ERROR,
  CLEAR_ERROR
} from '../actions/constants';
import { me, signedIn } from '../auth';
import { getSocket } from '../socket';

// The initial application state
const initialState = {
  error: '',
  currentlySending: false,
  loggedIn: signedIn(),
  currentUser: me(),
  socket: getSocket(),
};

// Takes care of changing the application state
function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_AUTH:
      return {
        ...state,
        loggedIn: action.newAuthState,
      };
    case SET_USER:
      return {
        ...state,
        currentUser: action.newUserState,
      };
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

export default authReducer;
