import {
  SET_AUTH,
  SET_USER
} from '../actions/constants';
import { me, signedIn } from '../auth';
import { getSocket } from '../socket';

// The initial application state
const initialState = {
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
    default:
     return state;
  }
}

export default authReducer;
