import {
  EDIT_POST_TITLE,
  EDIT_POST_CONTENT,
  SET_POST
} from '../actions/constants';

const initialState = {
  id: 0,
  author: {},
  type: 'text',
  title: '',
  content: '',
  inserted_at: '',
  updated_at: '',
};

function postReducer(state = initialState, action) {
  switch (action.type) {
    case EDIT_POST_TITLE:
      return {
        ...state,
        title: action.title
      };
    case EDIT_POST_CONTENT:
      return {
        ...state,
        content: action.content
      };
    case SET_POST:
      return action.post;
    default:
      return state;
  }
}

export default postReducer;