import { combineReducers } from 'redux';
import authReducer from './authReducer';
import createPostReducer from './createPostReducer';
import postListReducer from './postListReducer';
import apiReducer from './apiReducer';
import postReducer from './postReducer';

const reducer = combineReducers({
  auth: authReducer,
  createPost: createPostReducer,
  api: apiReducer,
  postList: postListReducer,
  post: postReducer
});

export default reducer;
