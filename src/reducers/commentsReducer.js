import {
  SENDING_COMMENT_REQUEST,
  COMMENT_REQUEST_ERROR,
  EDIT_COMMENT_CONTENT,
  ADD_COMMENT,
  ADD_COMMENTS,
  CLEAR_COMMENTS_STATE
} from "../actions/constants";

const initialState = {
  currentlySendingComment: false,
  commentRequestError: "",
  commentProgress: {}, // Holds text for while user writes a comment ref'd by ID
  commentMeta: {}, // Holds comment children pagination state ref'd by ID
  comments: {} // Holds comment data ref'd by ID
};

function commentsReducer(state = initialState, action) {
  switch (action.type) {
    case SENDING_COMMENT_REQUEST:
      return {
        ...state,
        currentlySendingComment: action.sending
      };
    case COMMENT_REQUEST_ERROR:
      return {
        ...state,
        commentRequestError: action.error
      };
    case EDIT_COMMENT_CONTENT:
      return {
        ...state,
        commentProgress: {
          ...state.commentProgress,
          [action.parent_id]: action.content
        }
      };
    case ADD_COMMENT:
      let commentDup = [...(state.comments[action.parent_id] || [])];
      commentDup.unshift(action.comment);
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.parent_id]: commentDup
        }
      };
    case ADD_COMMENTS:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.parent_id]: (state.comments[action.parent_id] || []).concat(action.comments)
        },
        commentMeta: {
          ...state.commentMeta,
          [action.parent_id]: action.pagination
        }
      }
    case CLEAR_COMMENTS_STATE:
      return initialState;
    default:
      return state;
  }
}

export default commentsReducer;
