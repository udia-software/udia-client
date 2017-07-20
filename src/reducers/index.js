import { combineReducers } from 'redux';
import userReducer from '../modules/user/reducer';
import postListReducer from './postListReducer';
import apiReducer from './apiReducer';
import postReducer from './postReducer';
import commentsReducer from './commentsReducer';

const reducer = combineReducers({
  api: apiReducer,
  postList: postListReducer,
  post: postReducer,
  user: userReducer,
  comments : commentsReducer
});

export default reducer;
