import {
  SET_POST
} from '../actions/constants';

const initialState = {
  post: null
};

function postListReducer(state = initialState, action) {
  switch (action.type) {
    case SET_POST:
      return {
        post: action.post
      };
    default:
      return state;
  }
}

export default postListReducer;