import {
  IS_GETTING_USER,
  SET_USER_ERROR,
  CLEAR_USER_ERROR,
  SET_USER
} from "./constants";

const initialState = {
  currentlyGettingUser: false,
  userRequestError: "",
  user: {}
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case IS_GETTING_USER:
      return {
        ...state,
        currentlyGettingUser: action.data
      };
    case SET_USER_ERROR:
      return {
        ...state,
        userRequestError: action.data
      };
    case CLEAR_USER_ERROR:
      return {
        ...state,
        userRequestError: ""
      };
    case SET_USER:
      return {
        ...state,
        user: action.data
      };
    default:
      return state;
  }
}

export default userReducer;
