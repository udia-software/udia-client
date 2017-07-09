import { combineReducers } from 'redux';
import authReducer from './authReducer';
import createPostReducer from './createPostReducer';
import postListReducer from './postListReducer';
import apiReducer from './apiReducer';

const reducer = combineReducers({
  auth: authReducer,
  createPost: createPostReducer,
  api: apiReducer,
  postList: postListReducer
});

export default reducer;
