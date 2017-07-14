import {
  SET_SELF_USER
} from '../actions/constants';
import { me } from '../auth';

// The initial application state
const initialState = {
  currentUser: me(),
};

// Takes care of changing the application state
function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELF_USER:
      return {
        ...state,
        currentUser: action.newUserState,
      };
    default:
     return state;
  }
}

export default authReducer;
