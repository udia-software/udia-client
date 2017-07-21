import {
  IS_SENDING_COMMENT,
  SET_COMMENT_ERROR,
  CLEAR_COMMENT_ERROR,
  ADD_COMMENT,
  ADD_COMMENTS,
  CLEAR_COMMENTS_STATE,
  SET_COMMENT_CONTENT
} from "./constants";

const initialState = {
  commentError: {}, // Holds text for errors on a comment ref'd by ID
  commentIsSending: {}, // Holds boolean for is sending on a comment ref'd by ID
  commentProgress: {}, // Holds text for while user writes a comment ref'd by ID
  commentPagination: {}, // Holds comment children pagination state ref'd by ID
  comments: {} // Holds comment data ref'd by ID
};

function commentsReducer(state = initialState, action) {
  switch (action.type) {
    case IS_SENDING_COMMENT:
      return {
        ...state,
        commentIsSending: {
          ...state.commentIsSending,
          [action.data.parent_id]: action.data.isSending
        }
      };
    case SET_COMMENT_ERROR:
      return {
        ...state,
        commentError: {
          ...state.commentError,
          [action.data.parent_id]: action.data.err
        }
      };
    case CLEAR_COMMENT_ERROR:
      return {
        ...state,
        commentError: {
          ...state.commentError,
          [action.data.parent_id]: ""
        }
      };
    case SET_COMMENT_CONTENT:
      return {
        ...state,
        commentProgress: {
          ...state.commentProgress,
          [action.data.parent_id]: action.data.content
        }
      };
    case ADD_COMMENT:
      let commentDup = [...(state.comments[action.data.parent_id] || [])];
      commentDup.unshift(action.data.comment);
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.data.parent_id]: commentDup
        }
      };
    case ADD_COMMENTS:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.data.parent_id]: (state.comments[action.data.parent_id] || [])
            .concat(action.data.comments)
        },
        commentPagination: {
          ...state.commentPagination,
          [action.data.parent_id]: action.data.pagination
        }
      };
    case CLEAR_COMMENTS_STATE:
      return initialState;
    default:
      return state;
  }
}

export default commentsReducer;
