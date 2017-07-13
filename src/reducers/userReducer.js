import {
  SET_USER
} from '../actions/constants';

const initialState = {
  username: "",
  updated_at: "",
  inserted_at: "",
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...action.user,        
      }
    default:
      return state;
  }
}

export default userReducer;
