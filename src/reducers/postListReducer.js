import {
  ADD_POSTS,
  SET_POSTS_PAGE_NUMBER,
  SET_POSTS_PAGE_SIZE,
  SET_POSTS_TOTAL_ENTRIES,
  SET_POSTS_TOTAL_PAGES,
  CLEAR_POST_LIST
} from '../actions/constants';

const initialState = {
  page_number: 0,
  page_size: 10,
  total_entries: 0,
  total_pages: 0,
  posts: []
};

function postListReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_POSTS:
      return {
        ...state,
        posts: state.posts.concat(action.posts)
      };
    case SET_POSTS_PAGE_NUMBER:
      return {
        ...state,
        page_number: action.page_number
      }
    case SET_POSTS_PAGE_SIZE:
      return {
        ...state,
        page_size: action.page_size
      }
    case SET_POSTS_TOTAL_ENTRIES:
      return {
        ...state,
        total_entries: action.total_entries
      }
    case SET_POSTS_TOTAL_PAGES:
      return {
        ...state,
        total_pages: action.total_pages
      }
    case CLEAR_POST_LIST:
      return initialState;
    default:
      return state;
  }
}

export default postListReducer;