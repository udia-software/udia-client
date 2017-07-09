import {
  ADD_POST
} from '../actions/constants';

const initialState = {
  posts: []
};

function postListReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_POST:
      return {
        posts: [...state.posts, action.post]
      };
    default:
      return state;
  }
}

export default postListReducer;