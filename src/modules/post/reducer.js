import {
  IS_SENDING_POST,
  SET_POST_ERROR,
  CLEAR_POST_ERROR,
  SET_POST,
  SET_POST_TITLE,
  SET_POST_CONTENT,
  SET_EDIT_POST_SUCCESS
} from "./constants";

const initialState = {
  sendingPostRequest: false,
  postRequestError: "",
  post: {},
  editSuccess: false
};

function postReducer(state = initialState, action) {
  switch (action.type) {
    case IS_SENDING_POST:
      return {
        ...state,
        sendingPostRequest: action.data
      };
    case SET_POST_ERROR:
      return {
        ...state,
        postRequestError: action.data
      };
    case CLEAR_POST_ERROR:
      return {
        ...state,
        postRequestError: ""
      };
    case SET_POST:
      return {
        ...state,
        post: action.data
      };
    case SET_POST_TITLE:
      return {
        ...state,
        post: {
          ...state.post,
          title: action.data
        }
      };
    case SET_POST_CONTENT:
      return {
        ...state,
        post: {
          ...state.post,
          content: action.data
        }
      };
    case SET_EDIT_POST_SUCCESS:
      return {
        ...state,
        editSuccess: action.data
      };
    default:
      return state;
  }
}

export default postReducer;
