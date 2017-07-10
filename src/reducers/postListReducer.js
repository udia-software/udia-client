import {
  ADD_POST,
  CLEAR_POST_LIST
} from '../actions/constants';

const initialState = {
  posts: []
};

function postListReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        posts: [...state.posts, action.post]
      };
    case CLEAR_POST_LIST:
      return {
        ...state,
        posts: []
      };
    default:
      return state;
  }
}

export default postListReducer;