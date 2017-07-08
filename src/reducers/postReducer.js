import {
  EDIT_POST_TITLE,
  EDIT_POST_CONTENT
} from '../actions/constants';

const initialState = {
  title: '',
  content: ''
};

function postReducer(state = initialState, action) {
  switch (action.type) {
    case EDIT_POST_TITLE:
      return action.title;
    case EDIT_POST_CONTENT:
      return action.content;
    default:
      return state;
  }
}

export default postReducer;