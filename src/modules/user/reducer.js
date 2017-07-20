import { SET_USER } from "./constants";

const initialState = {
  user: {}
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        user: action.user
      };
    default:
      return state;
  }
}

export default userReducer;
