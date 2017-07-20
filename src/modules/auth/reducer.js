import {
  IS_SENDING_AUTH,
  SET_AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  SET_SELF_USER,
  SET_USERNAME,
  SET_PASSWORD,
  SET_PASSWORD_CONFIRMATION
} from "./constants";
import { me } from "./api";

// The initial application state
const initialState = {
  sendingAuthRequest: false,
  authError: "",
  currentUser: me(),
  username: "",
  password: "",
  passwordConfirmation: ""
};

// Takes care of changing the application state
function authReducer(state = initialState, action) {
  switch (action.type) {
    case IS_SENDING_AUTH:
      return {
        ...state,
        sendingAuthRequest: action.data
      };
    case SET_AUTH_ERROR:
      return {
        ...state,
        authError: action.data
      };
    case CLEAR_AUTH_ERROR:
      return {
        ...state,
        authError: ""
      }
    case SET_SELF_USER:
      return {
        ...state,
        currentUser: action.data
      };
    case SET_USERNAME:
      return {
        ...state,
        username: action.data
      };
    case SET_PASSWORD:
      return {
        ...state,
        password: action.data
      };
    case SET_PASSWORD_CONFIRMATION:
      return {
        ...state,
        passwordConfirmation: action.data
      };
    default:
      return state;
  }
}

export default authReducer;
