import {
  IS_GETTING_POSTS,
  SET_POSTS_ERROR,
  CLEAR_POSTS_ERROR,
  ADD_POSTS,
  CLEAR_POSTS,
  SET_POSTS_PAGINATION
} from "./constants";

const initialState = {
  currentlyGettingPosts: false,
  postsRequestError: "",
  postsPagination: {},
  posts: []
};

function postsReducer(state = initialState, action) {
  switch (action.type) {
    case IS_GETTING_POSTS:
      return {
        ...state,
        currentlyGettingPosts: action.data
      };
    case SET_POSTS_ERROR:
      return {
        ...state,
        postsRequestError: action.data
      };
    case CLEAR_POSTS_ERROR:
      return {
        ...state,
        postsRequestError: ""
      };
    case ADD_POSTS:
      return {
        ...state,
        posts: state.posts.concat(action.data)
      };
    case SET_POSTS_PAGINATION:
      return {
        ...state,
        postsPagination: action.data
      };
    case CLEAR_POSTS:
      return initialState;
    default:
      return state;
  }
}

export default postsReducer;
