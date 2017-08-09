import {
  IS_SENDING_COMMENT,
  SET_COMMENT_ERROR,
  CLEAR_COMMENT_ERROR,
  ADD_COMMENT,
  ADD_COMMENTS,
  CLEAR_COMMENTS_STATE,
  SET_COMMENT_CONTENT,
  TOGGLE_COMMENT_REPLY_BOX,
  TOGGLE_EDIT_COMMENT,
  SET_EDIT_COMMENT_CONTENT,
  CLEAR_EDIT_COMMENT,
  REPLACE_COMMENT,
  IS_GETTING_USER_COMMENTS,
  SET_USER_COMMENTS_ERROR,
  CLEAR_USER_COMMENTS_ERROR,
  ADD_USER_COMMENTS,
  CLEAR_USER_COMMENTS,
  SET_USER_COMMENTS_PAGINATION
} from "./constants";

const initialState = {
  commentError: {}, // Holds text for errors on a comment ref'd by ID
  commentIsSending: {}, // Holds boolean for is sending on a comment ref'd by ID
  commentProgress: {}, // Holds text for while user writes a comment ref'd by ID
  commentPagination: {}, // Holds comment children pagination state ref'd by ID
  commentReplyBox: {}, // Holds whether or not to show comment reply box
  commentEditing: {}, // Holds whether or not the comment is being edited or not
  comments: {}, // Holds comment data ref'd by ID

  // for user comments in profile page
  currentlyGettingUserComments: false,
  userCommentsRequestError: "",
  userCommentsRequestPagination: "",
  userComments: []
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
    case TOGGLE_COMMENT_REPLY_BOX:
      return {
        ...state,
        commentReplyBox: {
          ...state.commentReplyBox,
          [action.data]: !state.commentReplyBox[action.data]
        }
      };
    case TOGGLE_EDIT_COMMENT:
      return {
        ...state,
        commentEditing: {
          ...state.commentEditing,
          [action.data.comment_id]: {
            isEditing: !(state.commentEditing[action.data.comment_id] || {})
              .isEditing,
            content: (state.commentEditing[action.data.comment_id] || {})
              .content || action.data.content
          }
        }
      };
    case SET_EDIT_COMMENT_CONTENT:
      return {
        ...state,
        commentEditing: {
          ...state.commentEditing,
          [action.data.comment_id]: {
            ...state.commentEditing[action.data.comment_id],
            content: action.data.content
          }
        }
      };
    case CLEAR_EDIT_COMMENT:
      return {
        ...state,
        commentEditing: {
          ...state.commentEditing,
          [action.data]: null
        }
      };
    case REPLACE_COMMENT:
      let commentRep = [...(state.comments[action.data.parent_id] || [])];
      for (let i = 0; i < commentRep.length; i++) {
        let repComment = commentRep[i];
        if (repComment.id === action.data.comment_id) {
          commentRep[i] = action.data.comment;
          break;
        }
      }
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.data.parent_id]: commentRep
        }
      };
    case IS_GETTING_USER_COMMENTS:
      return {
        ...state,
        currentlyGettingUserComments: action.data
      };
    case SET_USER_COMMENTS_ERROR:
      return {
        ...state,
        userCommentsRequestError: action.data
      };
    case CLEAR_USER_COMMENTS_ERROR:
      return {
        ...state,
        userCommentsRequestError: ""
      };
    case ADD_USER_COMMENTS:
      return {
        ...state,
        userComments: state.userComments.concat(action.data)
      };
    case SET_USER_COMMENTS_PAGINATION:
      return {
        ...state,
        userCommentsRequestPagination: action.data
      }
    case CLEAR_USER_COMMENTS:
      return {
        ...state,
        userComments: [],
        userCommentsRequestPagination: {},
        userCommentsRequestError: ""
      }
    case CLEAR_COMMENTS_STATE:
      return initialState;
    default:
      return state;
  }
}

export default commentsReducer;
